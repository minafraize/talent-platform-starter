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

export type IdentityUserCreatedEvent =
  Parameters<
    UserCreatedHandler["execute"]
  >[0];

export type IdentityAccountTypeChangedEvent =
  Parameters<
    HandleAccountTypeChangedUseCase["execute"]
  >[0];

export type ParsedProfileEvent =
  | {
      eventType:
        "identity.user.created";

      event:
        IdentityUserCreatedEvent;
    }
  | {
      eventType:
        "identity.account.type.changed";

      event:
        IdentityAccountTypeChangedEvent;
    };

export type DeadLetterReason =
  | "MISSING_MESSAGE_VALUE"
  | "INVALID_JSON"
  | "INVALID_EVENT"
  | "LEGACY_EVENT_WITHOUT_ACCOUNT_TYPE";

export class ProfileEventParseError
  extends Error
{
  constructor(
    public readonly reason:
      | "INVALID_JSON"
      | "INVALID_EVENT"
      | "LEGACY_EVENT_WITHOUT_ACCOUNT_TYPE",

    message:
      string,
  ) {
    super(message);

    this.name =
      "ProfileEventParseError";
  }
}

const AccountTypeSchema =
  z.enum([
    "USER",
    "TALENT",
    "PROFESSIONAL",
  ]);

/**
 * Legacy compatibility is limited to V1.
 *
 * Older identity.user.created events may omit
 * accountType, but they must still be V1 events.
 */
const LegacyUserCreatedEventSchema =
  z.object({
    eventId:
      z.string().uuid(),

    eventType:
      z.literal(
        "identity.user.created",
      ),

    version:
      z.literal(1),

    producer:
      z.string(),

    occurredAt:
      z.string(),

    aggregateId:
      z.string().uuid().optional(),

    payload:
      z.object({
        userId:
          z.string().uuid(),

        email:
          z.string().email(),

        accountType:
          AccountTypeSchema.optional(),
      }),
  });

function assertSupportedVersion(
  parsed:
    unknown,
): void {
  if (
    typeof parsed !==
      "object" ||
    parsed === null
  ) {
    return;
  }

  if (
    !("version" in parsed)
  ) {
    return;
  }

  const version =
    (
      parsed as {
        version?: unknown;
      }
    ).version;

  if (
    version !== 1
  ) {
    throw new ProfileEventParseError(
      "INVALID_EVENT",

      `Unsupported identity event version: ${String(
        version,
      )}`,
    );
  }
}

export function parseProfileEvent(
  buffer:
    Buffer,
): ParsedProfileEvent {
  let parsed:
    unknown;

  try {
    parsed =
      JSON.parse(
        buffer.toString("utf8"),
      );
  } catch {
    throw new ProfileEventParseError(
      "INVALID_JSON",

      "Kafka message is not valid JSON",
    );
  }

  /*
   * Version validation happens before
   * any compatibility parsing.
   *
   * This prevents version 2+ messages from
   * accidentally being accepted by a legacy schema.
   */
  assertSupportedVersion(
    parsed,
  );

  /*
   * -------------------------------------------------------------
   * identity.account.type.changed
   * -------------------------------------------------------------
   */
  const accountTypeChangedResult =
    AccountTypeChangedEventSchema.safeParse(
      parsed,
    );

  if (
    accountTypeChangedResult.success
  ) {
    const event =
      accountTypeChangedResult.data;

    return {
      eventType:
        "identity.account.type.changed",

      event,
    };
  }

  /*
   * -------------------------------------------------------------
   * identity.user.created - current contract
   * -------------------------------------------------------------
   */
  const userCreatedResult =
    UserCreatedEventSchema.safeParse(
      parsed,
    );

  if (
    userCreatedResult.success
  ) {
    const event =
      userCreatedResult.data;

    return {
      eventType:
        "identity.user.created",

      event: {
        eventId:
          event.eventId,

        eventType:
          event.eventType,

        version:
          event.version,

        producer:
          event.producer,

        occurredAt:
          event.occurredAt,

        userId:
          event.payload.userId,

        accountType:
          event.payload.accountType,

        email:
          event.payload.email,
      },
    };
  }

  /*
   * -------------------------------------------------------------
   * identity.user.created - legacy V1
   * -------------------------------------------------------------
   */
  const legacyResult =
    LegacyUserCreatedEventSchema.safeParse(
      parsed,
    );

  if (
    legacyResult.success
  ) {
    const event =
      legacyResult.data;

    if (
      !event.payload.accountType
    ) {
      throw new ProfileEventParseError(
        "LEGACY_EVENT_WITHOUT_ACCOUNT_TYPE",

        `Legacy identity.user.created event ${event.eventId} does not contain accountType`,
      );
    }

    return {
      eventType:
        "identity.user.created",

      event: {
        eventId:
          event.eventId,

        eventType:
          event.eventType,

        version:
          event.version,

        producer:
          event.producer,

        occurredAt:
          event.occurredAt,

        userId:
          event.payload.userId,

        accountType:
          event.payload.accountType,

        email:
          event.payload.email,
      },
    };
  }

  throw new ProfileEventParseError(
    "INVALID_EVENT",

    "Unsupported or invalid identity event",
  );
}