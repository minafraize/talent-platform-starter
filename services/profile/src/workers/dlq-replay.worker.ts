import "dotenv/config";

import { randomUUID } from "node:crypto";

import { Kafka } from "kafkajs";

import { prisma } from "../infrastructure/database/prisma.js";

import {
  ProfileDlqReplayService,
  type ProfileDlqReplaySelector,
} from "../infrastructure/kafka/profile-dlq-replay.js";

interface CliOptions {
  dlqTopic:
    string;

  selector:
    ProfileDlqReplaySelector;

  force:
    boolean;
}

function printUsage():
  void {
  console.log(`
DLQ Replay

Usage:

  pnpm --filter @talent/profile-service worker:dlq-replay -- \\
    --dlq-topic <topic> \\
    --event-id <eventId>

Or:

  pnpm --filter @talent/profile-service worker:dlq-replay -- \\
    --dlq-topic <topic> \\
    --dlq-partition <partition> \\
    --dlq-offset <offset>

Options:

  --dlq-topic <topic>
      DLQ Kafka topic.

  --event-id <uuid>
      Replay the DLQ record containing this original eventId.

  --dlq-partition <number>
      Exact DLQ partition.

  --dlq-offset <offset>
      Exact DLQ message offset.

  --force
      Replay even when ProcessedEvent already exists.

Environment fallbacks:

  KAFKA_PROFILE_DLQ_TOPIC
  KAFKA_BROKERS
`);
}

function parseInteger(
  value:
    string,

  name:
    string,
): number {
  const parsed =
    Number(value);

  if (
    !Number.isInteger(
      parsed,
    ) ||
    parsed < 0
  ) {
    throw new Error(
      `${name} must be a non-negative integer`,
    );
  }

  return parsed;
}

function parseArgs(
  args:
    string[],
): CliOptions {
  let dlqTopic =
    process.env
      .KAFKA_PROFILE_DLQ_TOPIC;

  let eventId:
    string | undefined;

  let dlqPartition:
    number | undefined;

  let dlqOffset:
    string | undefined;

  let force =
    false;

  for (
    let index = 0;
    index <
    args.length;
    index++
  ) {
    const argument =
      args[index];

    /*
     * pnpm passes the conventional "--"
     * separator through to the package script.
     *
     * It is not an application argument.
     */
    if (
      argument ===
      "--"
    ) {
      continue;
    }

    switch (
      argument
    ) {
      case "--help":
      case "-h":
        printUsage();

        process.exit(
          0,
        );

        break;

      case "--dlq-topic":
        dlqTopic =
          args[++index];

        break;

      case "--event-id":
        eventId =
          args[++index];

        break;

      case "--dlq-partition":
        dlqPartition =
          parseInteger(
            args[
              ++index
            ],
            "--dlq-partition",
          );

        break;

      case "--dlq-offset":
        dlqOffset =
          args[
            ++index
          ];

        break;

      case "--force":
        force =
          true;

        break;

      default:
        throw new Error(
          `Unknown argument: ${argument}`,
        );
    }
  }

  if (
    !dlqTopic
  ) {
    const identityTopic =
      process.env
        .KAFKA_IDENTITY_TOPIC ??
      "identity.events";

    dlqTopic =
      `${identityTopic}.dlq`;
  }

  const hasEventId =
    eventId !==
    undefined;

  const hasDlqPartition =
    dlqPartition !==
    undefined;

  const hasDlqOffset =
    dlqOffset !==
    undefined;

  if (
    !hasEventId &&
    !hasDlqPartition &&
    !hasDlqOffset
  ) {
    throw new Error(
      "Provide --event-id or --dlq-partition + --dlq-offset",
    );
  }

  if (
    (
      hasDlqPartition &&
      !hasDlqOffset
    ) ||
    (
      !hasDlqPartition &&
      hasDlqOffset
    )
  ) {
    throw new Error(
      "--dlq-partition and --dlq-offset must be provided together",
    );
  }

  if (
    eventId !==
      undefined &&
    !/^[0-9a-f-]{36}$/i.test(
      eventId,
    )
  ) {
    throw new Error(
      "--event-id must be a valid UUID",
    );
  }

  if (
    dlqOffset !==
      undefined &&
    !/^\d+$/.test(
      dlqOffset,
    )
  ) {
    throw new Error(
      "--dlq-offset must be a non-negative integer",
    );
  }

  return {
    dlqTopic,

    selector: {
      ...(eventId !==
      undefined
        ? {
            eventId,
          }
        : {}),

      ...(dlqPartition !==
      undefined
        ? {
            dlqPartition,
          }
        : {}),

      ...(dlqOffset !==
      undefined
        ? {
            dlqOffset,
          }
        : {}),
    },

    force,
  };
}

async function main():
  Promise<void> {
  const options =
    parseArgs(
      process.argv.slice(2),
    );

  const kafka =
    new Kafka({
      clientId:
        `profile-dlq-replay-${randomUUID()}`,

      brokers: (
        process.env.KAFKA_BROKERS ??
        "localhost:9092"
      ).split(","),
    });

  const replayService =
    new ProfileDlqReplayService(
      prisma,
      kafka,
    );

  try {
    const result =
      await replayService.replay(
        options.dlqTopic,

        options.selector,

        {
          force:
            options.force,
        },
      );

    console.log(
      JSON.stringify(
        {
          message:
            result.status ===
            "REPLAYED"
              ? "Profile DLQ event replayed"
              : "Profile DLQ event was already processed",

          ...result,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch(
  async (
    error,
  ) => {
    console.error(
      "Profile DLQ replay failed",
      error,
    );

    await prisma
      .$disconnect()
      .catch(
        () => undefined,
      );

    process.exit(
      1,
    );
  },
);