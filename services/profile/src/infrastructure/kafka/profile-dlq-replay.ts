import {
  Kafka,
  type Admin,
  type Consumer,
  type Producer,
} from "kafkajs";

import type {
  PrismaClient,
} from "../../generated/prisma/index.js";

import {
  extractEventIdFromRawValue,
  parseProfileDeadLetterRecord,
  type ProfileDeadLetterRecord,
} from "./profile-event-dlq.js";

export interface ProfileDlqReplaySelector {
  eventId?:
    string;

  dlqPartition?:
    number;

  dlqOffset?:
    string;
}

export interface ProfileDlqReplayOptions {
  force?:
    boolean;

  timeoutMs?:
    number;
}

export type ProfileDlqReplayStatus =
  | "REPLAYED"
  | "ALREADY_PROCESSED";

export interface ProfileDlqReplayResult {
  status:
    ProfileDlqReplayStatus;

  eventId:
    string | null;

  dlqTopic:
    string;

  dlqPartition:
    number;

  dlqOffset:
    string;

  sourceTopic:
    string;

  sourcePartition:
    number;

  sourceOffset:
    string;

  sourceKey:
    string | null;
}

interface MatchedDlqMessage {
  record:
    ProfileDeadLetterRecord;

  dlqPartition:
    number;

  dlqOffset:
    string;
}

function validateSelector(
  selector:
    ProfileDlqReplaySelector,
): void {
  const hasEventId =
    selector.eventId !==
    undefined;

  const hasDlqPartition =
    selector.dlqPartition !==
    undefined;

  const hasDlqOffset =
    selector.dlqOffset !==
    undefined;

  const hasDlqPosition =
    hasDlqPartition ||
    hasDlqOffset;

  if (
    !hasEventId &&
    !hasDlqPosition
  ) {
    throw new Error(
      "DLQ replay requires --event-id or --dlq-partition + --dlq-offset",
    );
  }

  if (
    hasDlqPosition &&
    (
      !hasDlqPartition ||
      !hasDlqOffset
    )
  ) {
    throw new Error(
      "Both --dlq-partition and --dlq-offset are required when replaying by DLQ position",
    );
  }
}

function matchesSelector(
  selector:
    ProfileDlqReplaySelector,

  record:
    ProfileDeadLetterRecord,

  dlqPartition:
    number,

  dlqOffset:
    string,
): boolean {
  if (
    selector.eventId !==
    undefined
  ) {
    const eventId =
      extractEventIdFromRawValue(
        record.rawValue,
      );

    if (
      eventId !==
      selector.eventId
    ) {
      return false;
    }
  }

  if (
    selector.dlqPartition !==
    undefined &&
    dlqPartition !==
      selector.dlqPartition
  ) {
    return false;
  }

  if (
    selector.dlqOffset !==
    undefined &&
    dlqOffset !==
      selector.dlqOffset
  ) {
    return false;
  }

  return true;
}

async function validateSourcePartition(
  admin:
    Admin,

  record:
    ProfileDeadLetterRecord,
): Promise<void> {
  if (
    record.rawValue ===
    null
  ) {
    throw new Error(
      "Cannot replay a DLQ record without rawValue",
    );
  }

  const metadata =
    await admin.fetchTopicMetadata({
      topics: [
        record.source.topic,
      ],
    });

  const sourceTopic =
    metadata.topics.find(
      (topic) =>
        topic.name ===
        record.source.topic,
    );

  if (
    !sourceTopic
  ) {
    throw new Error(
      `Source topic "${record.source.topic}" was not found`,
    );
  }

  const sourcePartition =
    sourceTopic.partitions.find(
      (partition) =>
        partition.partitionId ===
        record.source.partition,
    );

  if (
    !sourcePartition
  ) {
    throw new Error(
      `Source partition ${record.source.partition} does not exist for topic "${record.source.topic}"`,
    );
  }
}

export class ProfileDlqReplayService {
  constructor(
    private readonly prisma:
      PrismaClient,

    private readonly kafka:
      Kafka,
  ) {}

  async replay(
    dlqTopic:
      string,

    selector:
      ProfileDlqReplaySelector,

    options:
      ProfileDlqReplayOptions = {},
  ): Promise<ProfileDlqReplayResult> {
    validateSelector(
      selector,
    );

    const admin =
      this.kafka.admin();

    const producer =
      this.kafka.producer();

    const consumer:
      Consumer =
      this.kafka.consumer({
        groupId:
          `profile-dlq-replay-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`,
      });

    let adminConnected =
      false;

    let producerConnected =
      false;

    let consumerConnected =
      false;

    let consumerRunning =
      false;

    let settled =
      false;

    let resolveMatch:
      (
        result:
          ProfileDlqReplayResult,
      ) => void;

    let rejectMatch:
      (
        error:
          Error,
      ) => void;

    const matchPromise =
      new Promise<ProfileDlqReplayResult>(
        (
          resolve,
          reject,
        ) => {
          resolveMatch =
            resolve;

          rejectMatch =
            reject;
        },
      );

    const timeoutMs =
      options.timeoutMs ??
      30_000;

    const timeout =
      setTimeout(
        () => {
          if (
            settled
          ) {
            return;
          }

          settled =
            true;

          rejectMatch(
            new Error(
              `No matching DLQ record found within ${timeoutMs}ms`,
            ),
          );
        },
        timeoutMs,
      );

    try {
      await admin.connect();

      adminConnected =
        true;

      await producer.connect();

      producerConnected =
        true;

      await consumer.connect();

      consumerConnected =
        true;

      await consumer.subscribe({
        topic:
          dlqTopic,

        fromBeginning:
          true,
      });

      await consumer.run({
        eachMessage:
          async ({
            partition:
              dlqPartition,

            message,
          }) => {
            if (
              settled
            ) {
              return;
            }

            if (
              !message.value
            ) {
              /*
               * A missing value cannot be parsed
               * as a DLQ envelope.
               *
               * Skip unless the caller explicitly
               * requested this exact DLQ position.
               */
              if (
                selector.dlqPartition ===
                  dlqPartition &&
                selector.dlqOffset ===
                  message.offset
              ) {
                settled =
                  true;

                rejectMatch(
                  new Error(
                    "Target DLQ message does not contain a value",
                  ),
                );
              }

              return;
            }

            let record:
              ProfileDeadLetterRecord;

            try {
              record =
                parseProfileDeadLetterRecord(
                  message.value,
                );
            } catch (
              error
            ) {
              if (
                selector.dlqPartition ===
                  dlqPartition &&
                selector.dlqOffset ===
                  message.offset
              ) {
                settled =
                  true;

                rejectMatch(
                  error instanceof
                    Error
                    ? error
                    : new Error(
                        String(error),
                      ),
                );
              }

              return;
            }

            if (
              !matchesSelector(
                selector,

                record,

                dlqPartition,

                message.offset,
              )
            ) {
              return;
            }

            if (
              settled
            ) {
              return;
            }

            const eventId =
              extractEventIdFromRawValue(
                record.rawValue,
              );

            if (
              record.rawValue ===
              null
            ) {
              settled =
                true;

              rejectMatch(
                new Error(
                  "Cannot replay DLQ record without rawValue",
                ),
              );

              return;
            }

            if (
              record.source.topic ===
              dlqTopic
            ) {
              settled =
                true;

              rejectMatch(
                new Error(
                  `Refusing to replay DLQ record back into the same topic "${dlqTopic}"`,
                ),
              );

              return;
            }

            try {
              await validateSourcePartition(
                admin,
                record,
              );

              if (
                eventId &&
                !options.force
              ) {
                const processedEvent =
                  await this.prisma.processedEvent.findUnique({
                    where: {
                      eventId,
                    },
                  });

                if (
                  processedEvent
                ) {
                  settled =
                    true;

                  resolveMatch({
                    status:
                      "ALREADY_PROCESSED",

                    eventId,

                    dlqTopic,

                    dlqPartition,

                    dlqOffset:
                      message.offset,

                    sourceTopic:
                      record.source.topic,

                    sourcePartition:
                      record.source.partition,

                    sourceOffset:
                      record.source.offset,

                    sourceKey:
                      record.source.key,
                  });

                  return;
                }
              }

              await producer.send({
                topic:
                  record.source.topic,

                messages: [
                  {
                    partition:
                      record.source.partition,

                    key:
                      record.source.key ??
                      undefined,

                    value:
                      record.rawValue,

                    headers: {
                      "x-profile-dlq-replay":
                        "true",

                      "x-profile-dlq-topic":
                        dlqTopic,

                      "x-profile-dlq-partition":
                        String(
                          dlqPartition,
                        ),

                      "x-profile-dlq-offset":
                        message.offset,
                    },
                  },
                ],
              });

              settled =
                true;

              resolveMatch({
                status:
                  "REPLAYED",

                eventId,

                dlqTopic,

                dlqPartition,

                dlqOffset:
                  message.offset,

                sourceTopic:
                  record.source.topic,

                sourcePartition:
                  record.source.partition,

                sourceOffset:
                  record.source.offset,

                sourceKey:
                  record.source.key,
              });
            } catch (
              error
            ) {
              settled =
                true;

              rejectMatch(
                error instanceof
                  Error
                  ? error
                  : new Error(
                      String(error),
                    ),
              );
            }
          },
      });

      consumerRunning =
        true;

      return await matchPromise;
    } finally {
      clearTimeout(
        timeout,
      );

      if (
        consumerRunning
      ) {
        await consumer
          .stop()
          .catch(
            () => undefined,
          );
      }

      if (
        consumerConnected
      ) {
        await consumer
          .disconnect()
          .catch(
            () => undefined,
          );
      }

      if (
        producerConnected
      ) {
        await producer
          .disconnect()
          .catch(
            () => undefined,
          );
      }

      if (
        adminConnected
      ) {
        await admin
          .disconnect()
          .catch(
            () => undefined,
          );
      }
    }
  }
}