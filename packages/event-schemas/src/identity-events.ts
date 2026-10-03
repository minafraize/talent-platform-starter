import { z } from "zod";

import {
  ACCOUNT_TYPES,
} from "@talent/contracts";

const AccountTypeSchema =
  z.enum(
    ACCOUNT_TYPES,
  );

/*
 * ------------------------------------------------------------------
 * identity.user.created
 * ------------------------------------------------------------------
 */

export const UserCreatedEventV1Schema =
  z
    .object({
      eventId:
        z.string().uuid(),

      eventType:
        z.literal(
          "identity.user.created",
        ),

      version:
        z.literal(1),

      producer:
        z.literal(
          "identity-service",
        ),

      occurredAt:
        z.string().datetime(),

      aggregateId:
        z.string().uuid(),

      payload:
        z
          .object({
            userId:
              z.string().uuid(),

            email:
              z.string().email(),

            accountType:
              AccountTypeSchema,
          })
          .strict(),
    })
    .strict();

export type UserCreatedEventV1 =
  z.infer<
    typeof UserCreatedEventV1Schema
  >;

/*
 * Public schema.
 *
 * Currently only V1 is supported.
 *
 * When V2 is introduced, this becomes:
 *
 * z.union([
 *   UserCreatedEventV1Schema,
 *   UserCreatedEventV2Schema,
 * ])
 */
export const UserCreatedEventSchema =
  UserCreatedEventV1Schema;

export type UserCreatedEvent =
  UserCreatedEventV1;

/*
 * ------------------------------------------------------------------
 * identity.account.type.changed
 * ------------------------------------------------------------------
 */

export const AccountTypeChangedEventV1Schema =
  z
    .object({
      eventId:
        z.string().uuid(),

      eventType:
        z.literal(
          "identity.account.type.changed",
        ),

      version:
        z.literal(1),

      producer:
        z.literal(
          "identity-service",
        ),

      occurredAt:
        z.string().datetime(),

      aggregateId:
        z.string().uuid(),

      payload:
        z
          .object({
            userId:
              z.string().uuid(),

            previousAccountType:
              AccountTypeSchema,

            newAccountType:
              AccountTypeSchema,
          })
          .strict(),
    })
    .strict();

export type AccountTypeChangedEventV1 =
  z.infer<
    typeof AccountTypeChangedEventV1Schema
  >;

/*
 * Public schema.
 *
 * Currently only V1 is supported.
 *
 * Future V2:
 *
 * const AccountTypeChangedEventSchema =
 *   z.union([
 *     AccountTypeChangedEventV1Schema,
 *     AccountTypeChangedEventV2Schema,
 *   ]);
 */
export const AccountTypeChangedEventSchema =
  AccountTypeChangedEventV1Schema;

export type AccountTypeChangedEvent =
  AccountTypeChangedEventV1;