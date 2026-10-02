import {
  Kafka,
  logLevel,
  type Consumer,
} from "kafkajs";

import type { PrismaClient } from "../../generated/prisma/index.js";
import { z } from "zod";

import {
  AccountTypeChangedEventSchema,
  UserCreatedEventSchema,
} from "@talent/event-schemas";

import {
  HandleAccountTypeChangedUseCase,
} from "../../application/use-cases/handle-account-type-changed.js";

import {
  HandleUserCreatedUseCase as UserCreatedHandler,
} from "../../application/use-cases/handle-user-created.js";

import type {
  ProfileFailureInjector,
} from "../../application/ports/profile-failure-injector.js";

interface ProfileEventsConsumerOptions {
  topic?: string;
  groupId?: string;
  fromBeginning?: boolean;
  failureInjector?: ProfileFailureInjector;

  /**
   * When true, wait until Kafka assigns this consumer to its group
   * before resolving startProfileEventsConsumer().
   *
   * This is useful for deterministic E2E/integration tests where the
   * producer may publish immediately after the consumer starts.
   */
  waitForReady?: boolean;
  readyTimeoutMs?: number;
}

export interface ProfileEventsConsumerRuntime {
  stop(): Promise<void>;
}

/**
 * identity.user.created is currently consumed by the existing
 * HandleUserCreatedUseCase, which uses a flattened internal DTO.
 */
type IdentityUserCreatedEvent =
  Parameters<UserCreatedHandler["execute"]>[0];

/**
 * identity.account.type.changed is consumed using the shared
 * AccountTypeChangedEvent contract directly.
 */
type IdentityAccountTypeChangedEvent =
  Parameters<
    HandleAccountTypeChangedUseCase["execute"]
  >[0];

type ParsedProfileEvent =
  | {
      eventType: "identity.user.created";
      event: IdentityUserCreatedEvent;
    }
  | {
      eventType: "identity.account.type.changed";
      event: IdentityAccountTypeChangedEvent;
    };

const AccountTypeSchema = z.enum([
  "USER",
  "TALENT",
  "PROFESSIONAL",
]);

/**
 * Backward-compatible schema for old identity.user.created events
 * that may not contain accountType yet.
 *
 * Current contract requires accountType, but older Kafka messages may
 * still exist in the topic.
 */
const LegacyUserCreatedEventSchema =
  z.object({
    eventId: z.string().uuid(),

    eventType: z.literal(
      "identity.user.created",
    ),

    version: z.number().int().positive(),

    producer: z.string(),

    occurredAt: z.string(),

    aggregateId:
      z.string().uuid().optional(),

    payload: z.object({
      userId: z.string().uuid(),

      email: z.string().email(),

      accountType:
        AccountTypeSchema.optional(),
    }),
  });

function parseMessage(
  buffer: Buffer,
): ParsedProfileEvent | null {
  const parsed: unknown =
    JSON.parse(
      buffer.toString("utf8"),
    );

  /**
   * -------------------------------------------------------------
   * identity.account.type.changed
   * -------------------------------------------------------------
   *
   * IMPORTANT:
   *
   * This event must be passed to the use case using the complete
   * shared event envelope.
   *
   * Do NOT flatten:
   *
   *   payload.userId
   *   payload.previousAccountType
   *   payload.newAccountType
   *
   * into the root event.
   */
  const accountTypeChangedResult =
    AccountTypeChangedEventSchema.safeParse(
      parsed,
    );

  if (accountTypeChangedResult.success) {
    const event =
      accountTypeChangedResult.data;

    return {
      eventType:
        "identity.account.type.changed",

      /**
       * Keep the shared contract intact.
       */
      event,
    };
  }

  /**
   * -------------------------------------------------------------
   * identity.user.created - current contract
   * -------------------------------------------------------------
   */
  const userCreatedResult =
    UserCreatedEventSchema.safeParse(
      parsed,
    );

  if (userCreatedResult.success) {
    const event =
      userCreatedResult.data;

    return {
      eventType:
        "identity.user.created",

      /**
       * The existing HandleUserCreatedUseCase expects a flattened
       * internal event DTO, so map the contract here.
       */
      event: {
        eventId: event.eventId,
        eventType: event.eventType,
        version: event.version,
        producer: event.producer,
        occurredAt: event.occurredAt,
        userId: event.payload.userId,
        accountType:
          event.payload.accountType,
        email: event.payload.email,
      },
    };
  }

  /**
   * -------------------------------------------------------------
   * identity.user.created - legacy compatibility
   * -------------------------------------------------------------
   *
   * Older events may have been produced before accountType
   * became mandatory.
   *
   * We keep consuming them safely, but ignore them because
   * Profile cannot determine which persona profile to create
   * without accountType.
   */
  const legacyUserCreatedResult =
    LegacyUserCreatedEventSchema.safeParse(
      parsed,
    );

  if (legacyUserCreatedResult.success) {
    const event =
      legacyUserCreatedResult.data;

    if (!event.payload.accountType) {
      console.warn(
        JSON.stringify({
          message:
            "Skipping legacy identity.user.created event without accountType",

          eventId:
            event.eventId,

          userId:
            event.payload.userId,
        }),
      );

      return null;
    }

    return {
      eventType:
        "identity.user.created",

      event: {
        eventId: event.eventId,
        eventType: event.eventType,
        version: event.version,
        producer: event.producer,
        occurredAt: event.occurredAt,
        userId: event.payload.userId,
        accountType:
          event.payload.accountType,
        email: event.payload.email,
      },
    };
  }

  throw new Error(
    "Unsupported or invalid identity event",
  );
}

async function waitForConsumerReady(
  consumer: Consumer,
  timeoutMs: number,
): Promise<void> {
  await new Promise<void>(
    (resolve, reject) => {
      let settled = false;

      const finish = (
        callback: () => void,
      ): void => {
        if (settled) {
          return;
        }

        settled = true;

        clearTimeout(timer);

        callback();
      };

      const timer = setTimeout(
        () => {
          finish(() => {
            reject(
              new Error(
                `Kafka consumer did not join its group within ${timeoutMs}ms`,
              ),
            );
          });
        },
        timeoutMs,
      );

      consumer.on(
        consumer.events.GROUP_JOIN,
        () => {
          finish(resolve);
        },
      );

      consumer.on(
        consumer.events.CRASH,
        () => {
          finish(() => {
            reject(
              new Error(
                "Kafka consumer crashed before it became ready",
              ),
            );
          });
        },
      );
    },
  );
}

export async function startProfileEventsConsumer(
  prisma: PrismaClient,
  options: ProfileEventsConsumerOptions = {},
): Promise<ProfileEventsConsumerRuntime> {
  const kafka = new Kafka({
    clientId:
      "profile-service",

    brokers: (
      process.env.KAFKA_BROKERS ??
      "localhost:9092"
    ).split(","),

    logLevel:
      logLevel.INFO,

    retry: {
      initialRetryTime: 100,
      factor: 1,
      multiplier: 1,
      retries: 1,
    },
  });

  const consumer: Consumer =
    kafka.consumer({
      groupId:
        options.groupId ??
        process.env.KAFKA_PROFILE_GROUP_ID ??
        "profile-service-v1",
    });

  const topic =
    options.topic ??
    process.env.KAFKA_IDENTITY_TOPIC ??
    "identity.events";

  const userCreatedUseCase =
    new UserCreatedHandler(
      prisma,
      options.failureInjector,
    );

  const accountTypeChangedUseCase =
    new HandleAccountTypeChangedUseCase(
      prisma,
    );

  const readyPromise =
    options.waitForReady
      ? waitForConsumerReady(
          consumer,
          options.readyTimeoutMs ??
            10_000,
        )
      : null;

  await consumer.connect();

  await consumer.subscribe({
    topic,

    fromBeginning:
      options.fromBeginning ?? false,
  });

  await consumer.run({
    eachMessage: async ({
      message,
    }) => {
      if (!message.value) {
        return;
      }

      const parsedEvent =
        parseMessage(
          message.value,
        );

      if (!parsedEvent) {
        return;
      }

      /**
       * ---------------------------------------------------------
       * identity.user.created
       * ---------------------------------------------------------
       */
      if (
        parsedEvent.eventType ===
        "identity.user.created"
      ) {
        await userCreatedUseCase.execute(
          parsedEvent.event,
        );

        console.log(
          JSON.stringify({
            message:
              "Profile user-created event processed",

            eventId:
              parsedEvent.event
                .eventId,

            userId:
              parsedEvent.event
                .userId,

            accountType:
              parsedEvent.event
                .accountType,
          }),
        );

        return;
      }

      /**
       * ---------------------------------------------------------
       * identity.account.type.changed
       * ---------------------------------------------------------
       *
       * The event is the complete shared contract.
       *
       * Therefore the data lives under:
       *
       *   parsedEvent.event.payload.userId
       *   parsedEvent.event.payload.previousAccountType
       *   parsedEvent.event.payload.newAccountType
       */
      if (
        parsedEvent.eventType ===
        "identity.account.type.changed"
      ) {
        const result =
          await accountTypeChangedUseCase.execute(
            parsedEvent.event,
          );

        console.log(
          JSON.stringify({
            message:
              result.outcome === "APPLIED"
                ? "Profile account-type-changed event processed"
                : "Profile stale account-type-changed event ignored",

            eventId:
              parsedEvent.event.eventId,

            userId:
              parsedEvent.event.payload
                .userId,

            previousAccountType:
              parsedEvent.event.payload
                .previousAccountType,

            newAccountType:
              parsedEvent.event.payload
                .newAccountType,

            outcome:
              result.outcome,
          }),
        );

        return;
      }

      /**
       * The discriminated union above means we should never reach
       * this branch.
       */
      const exhaustiveCheck: never =
        parsedEvent;

      throw new Error(
        `Unsupported parsed profile event: ${String(
          exhaustiveCheck,
        )}`,
      );
    },
  });

  if (readyPromise) {
    await readyPromise;
  }

  return {
    async stop(): Promise<void> {
      await consumer.disconnect();
    },
  };
}