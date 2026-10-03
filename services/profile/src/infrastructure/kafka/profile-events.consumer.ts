import {
  Kafka,
  logLevel,
  type Consumer,
  type Producer,
} from "kafkajs";

import type {
  PrismaClient,
} from "../../generated/prisma/index.js";

import {
  HandleAccountTypeChangedUseCase,
} from "../../application/use-cases/handle-account-type-changed.js";

import {
  HandleUserCreatedUseCase as UserCreatedHandler,
} from "../../application/use-cases/handle-user-created.js";

import type {
  ProfileFailureInjector,
} from "../../application/ports/profile-failure-injector.js";

import {
  parseProfileEvent,
  ProfileEventParseError,
} from "./profile-event.parser.js";

import {
  createProfileDeadLetterRecord,
  type DeadLetterReason,
} from "./profile-event-dlq.js";

interface ProfileEventsConsumerOptions {
  topic?:
    string;

  groupId?:
    string;

  fromBeginning?:
    boolean;

  failureInjector?:
    ProfileFailureInjector;

  dlqTopic?:
    string;

  waitForReady?:
    boolean;

  readyTimeoutMs?:
    number;
}

export interface ProfileEventsConsumerRuntime {
  stop():
    Promise<void>;
}

async function waitForConsumerReady(
  consumer:
    Consumer,

  timeoutMs:
    number,
): Promise<void> {
  await new Promise<void>(
    (
      resolve,
      reject,
    ) => {
      let settled =
        false;

      const finish = (
        callback:
          () => void,
      ): void => {
        if (
          settled
        ) {
          return;
        }

        settled =
          true;

        clearTimeout(
          timer,
        );

        callback();
      };

      const timer =
        setTimeout(
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

async function publishDeadLetter(
  producer:
    Producer,

  dlqTopic:
    string,

  metadata: {
    reason:
      DeadLetterReason;

    error:
      string;

    topic:
      string;

    partition:
      number;

    offset:
      string;

    key:
      string | null;

    timestamp:
      string | null;

    rawValue:
      string | null;
  },
): Promise<void> {
  const record =
    createProfileDeadLetterRecord(
      metadata,
    );

  await producer.send({
    topic:
      dlqTopic,

    messages: [
      {
        key:
          metadata.key ??
          undefined,

        value:
          JSON.stringify(
            record,
          ),
      },
    ],
  });

  console.error(
    JSON.stringify({
      message:
        "Profile Kafka event moved to DLQ",

      reason:
        metadata.reason,

      sourceTopic:
        metadata.topic,

      partition:
        metadata.partition,

      offset:
        metadata.offset,

      dlqTopic,

      error:
        metadata.error,
    }),
  );
}

export async function startProfileEventsConsumer(
  prisma:
    PrismaClient,

  options:
    ProfileEventsConsumerOptions = {},
): Promise<ProfileEventsConsumerRuntime> {
  const kafka =
    new Kafka({
      clientId:
        "profile-service",

      brokers: (
        process.env.KAFKA_BROKERS ??
        "localhost:9092"
      ).split(","),

      logLevel:
        logLevel.INFO,

      retry: {
        initialRetryTime:
          100,

        factor:
          1,

        multiplier:
          1,

        retries:
          5,
      },
    });

  const consumer:
    Consumer =
    kafka.consumer({
      groupId:
        options.groupId ??
        process.env
          .KAFKA_PROFILE_GROUP_ID ??
        "profile-service-v1",
    });

  const producer:
    Producer =
    kafka.producer();

  const topic =
    options.topic ??
    process.env
      .KAFKA_IDENTITY_TOPIC ??
    "identity.events";

  const dlqTopic =
    options.dlqTopic ??
    process.env
      .KAFKA_PROFILE_DLQ_TOPIC ??
    `${topic}.dlq`;

  if (
    topic ===
    dlqTopic
  ) {
    throw new Error(
      `Profile Kafka DLQ topic must differ from source topic: ${topic}`,
    );
  }

  const userCreatedUseCase =
    new UserCreatedHandler(
      prisma,
      options.failureInjector,
    );

  const accountTypeChangedUseCase =
    new HandleAccountTypeChangedUseCase(
      prisma,
      options.failureInjector,
    );

  const readyPromise =
    options.waitForReady
      ? waitForConsumerReady(
          consumer,
          options.readyTimeoutMs ??
            10_000,
        )
      : null;

  await producer.connect();

  try {
    await consumer.connect();

    await consumer.subscribe({
      topic,

      fromBeginning:
        options.fromBeginning ??
        false,
    });

    await consumer.run({
      eachMessage:
        async ({
          topic:
            messageTopic,

          partition,

          message,
        }) => {
          if (
            !message.value
          ) {
            await publishDeadLetter(
              producer,
              dlqTopic,
              {
                reason:
                  "MISSING_MESSAGE_VALUE",

                error:
                  "Kafka message does not contain a value",

                topic:
                  messageTopic,

                partition,

                offset:
                  message.offset,

                key:
                  message.key
                    ? message.key.toString(
                        "utf8",
                      )
                    : null,

                timestamp:
                  message.timestamp ??
                  null,

                rawValue:
                  null,
              },
            );

            return;
          }

          const rawValue =
            message.value.toString(
              "utf8",
            );

          let parsedEvent;

          try {
            parsedEvent =
              parseProfileEvent(
                message.value,
              );
          } catch (
            error
          ) {
            const reason =
              error instanceof
                ProfileEventParseError
                ? error.reason
                : "INVALID_EVENT";

            const errorMessage =
              error instanceof Error
                ? error.message
                : String(error);

            await publishDeadLetter(
              producer,
              dlqTopic,
              {
                reason,

                error:
                  errorMessage,

                topic:
                  messageTopic,

                partition,

                offset:
                  message.offset,

                key:
                  message.key
                    ? message.key.toString(
                        "utf8",
                      )
                    : null,

                timestamp:
                  message.timestamp ??
                  null,

                rawValue,
              },
            );

            return;
          }

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

          if (
            parsedEvent.eventType ===
            "identity.account.type.changed"
          ) {
            const result =
              await accountTypeChangedUseCase.execute(
                parsedEvent.event,
              );

            let logMessage =
              "Profile account-type-changed event processed";

            if (
              result.outcome ===
              "APPLIED_WITH_GAP"
            ) {
              logMessage =
                "Profile account-type-changed event processed with state gap";
            }

            if (
              result.outcome ===
              "IGNORED_STALE"
            ) {
              logMessage =
                "Profile stale account-type-changed event ignored";
            }

            console.log(
              JSON.stringify({
                message:
                  logMessage,

                eventId:
                  parsedEvent.event
                    .eventId,

                userId:
                  parsedEvent.event
                    .payload
                    .userId,

                previousAccountType:
                  parsedEvent.event
                    .payload
                    .previousAccountType,

                newAccountType:
                  parsedEvent.event
                    .payload
                    .newAccountType,

                outcome:
                  result.outcome,
              }),
            );

            return;
          }
        },
    });

    if (
      readyPromise
    ) {
      await readyPromise;
    }
  } catch (
    error
  ) {
    await consumer
      .disconnect()
      .catch(
        () => undefined,
      );

    await producer
      .disconnect()
      .catch(
        () => undefined,
      );

    throw error;
  }

  return {
    async stop():
      Promise<void> {
      try {
        await consumer.disconnect();
      } finally {
        await producer.disconnect();
      }
    },
  };
}