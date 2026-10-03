import { z } from "zod";

export const DeadLetterReasonSchema =
  z.enum([
    "MISSING_MESSAGE_VALUE",
    "INVALID_JSON",
    "INVALID_EVENT",
    "LEGACY_EVENT_WITHOUT_ACCOUNT_TYPE",
  ]);

export type DeadLetterReason =
  z.infer<
    typeof DeadLetterReasonSchema
  >;

const DeadLetterSourceSchema =
  z
    .object({
      topic:
        z.string().min(1),

      partition:
        z.number().int().nonnegative(),

      offset:
        z
          .string()
          .regex(
            /^\d+$/,
          ),

      key:
        z.string().nullable(),

      timestamp:
        z.string().nullable(),
    })
    .strict();

export const ProfileDeadLetterRecordSchema =
  z
    .object({
      version:
        z.literal(1),

      eventType:
        z.literal(
          "profile.event.dead_lettered",
        ),

      producer:
        z.literal(
          "profile-service",
        ),

      occurredAt:
        z.string(),

      reason:
        DeadLetterReasonSchema,

      error:
        z.string(),

      source:
        DeadLetterSourceSchema,

      rawValue:
        z.string().nullable(),
    })
    .strict();

export type ProfileDeadLetterRecord =
  z.infer<
    typeof ProfileDeadLetterRecordSchema
  >;

export interface CreateDeadLetterRecordInput {
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
}

export function createProfileDeadLetterRecord(
  input:
    CreateDeadLetterRecordInput,
): ProfileDeadLetterRecord {
  return {
    version:
      1,

    eventType:
      "profile.event.dead_lettered",

    producer:
      "profile-service",

    occurredAt:
      new Date().toISOString(),

    reason:
      input.reason,

    error:
      input.error,

    source: {
      topic:
        input.topic,

      partition:
        input.partition,

      offset:
        input.offset,

      key:
        input.key,

      timestamp:
        input.timestamp,
    },

    rawValue:
      input.rawValue,
  };
}

export function parseProfileDeadLetterRecord(
  value:
    string | Buffer,
): ProfileDeadLetterRecord {
  let parsed:
    unknown;

  try {
    parsed =
      JSON.parse(
        value.toString(
          "utf8",
        ),
      );
  } catch {
    throw new Error(
      "Profile DLQ message is not valid JSON",
    );
  }

  const result =
    ProfileDeadLetterRecordSchema.safeParse(
      parsed,
    );

  if (
    !result.success
  ) {
    throw new Error(
      `Invalid profile DLQ record: ${result.error.message}`,
    );
  }

  return result.data;
}

export function extractEventIdFromRawValue(
  rawValue:
    string | null,
): string | null {
  if (
    rawValue ===
    null
  ) {
    return null;
  }

  try {
    const parsed:
      unknown =
      JSON.parse(
        rawValue,
      );

    if (
      typeof parsed !==
        "object" ||
      parsed === null
    ) {
      return null;
    }

    if (
      !(
        "eventId" in
        parsed
      )
    ) {
      return null;
    }

    const eventId =
      (
        parsed as {
          eventId?:
            unknown;
        }
      ).eventId;

    const result =
      z
        .string()
        .uuid()
        .safeParse(
          eventId,
        );

    return result.success
      ? result.data
      : null;
  } catch {
    return null;
  }
}