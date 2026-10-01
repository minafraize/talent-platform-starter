import { z } from "zod";
import { ACCOUNT_TYPES } from "@talent/contracts";

const AccountTypeSchema = z.enum(
  ACCOUNT_TYPES,
);

export const UserCreatedEventSchema =
  z.object({
    eventId: z.string().uuid(),

    eventType: z.literal(
      "identity.user.created",
    ),

    version: z.literal(1),

    producer: z.literal(
      "identity-service",
    ),

    occurredAt:
      z.string().datetime(),

    aggregateId:
      z.string().uuid(),

    payload: z.object({
      userId:
        z.string().uuid(),

      email:
        z.string().email(),

      accountType:
        AccountTypeSchema,
    }),
  });

export type UserCreatedEvent =
  z.infer<
    typeof UserCreatedEventSchema
  >;

export const AccountTypeChangedEventSchema =
  z.object({
    eventId: z.string().uuid(),

    eventType: z.literal(
      "identity.account.type.changed",
    ),

    version: z.literal(1),

    producer: z.literal(
      "identity-service",
    ),

    occurredAt:
      z.string().datetime(),

    aggregateId:
      z.string().uuid(),

    payload: z.object({
      userId:
        z.string().uuid(),

      previousAccountType:
        AccountTypeSchema,

      newAccountType:
        AccountTypeSchema,
    }),
  });

export type AccountTypeChangedEvent =
  z.infer<
    typeof AccountTypeChangedEventSchema
  >;