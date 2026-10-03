import {
  describe,
  expect,
  it,
} from "vitest";

import {
  AccountTypeChangedEventSchema,
  AccountTypeChangedEventV1Schema,
  UserCreatedEventSchema,
  UserCreatedEventV1Schema,
} from "@talent/event-schemas";

function buildAccountTypeChangedEvent() {
  return {
    eventId:
      crypto.randomUUID(),

    eventType:
      "identity.account.type.changed" as const,

    version:
      1 as const,

    producer:
      "identity-service" as const,

    occurredAt:
      new Date().toISOString(),

    aggregateId:
      crypto.randomUUID(),

    payload: {
      userId:
        crypto.randomUUID(),

      previousAccountType:
        "USER" as const,

      newAccountType:
        "TALENT" as const,
    },
  };
}

function buildUserCreatedEvent() {
  return {
    eventId:
      crypto.randomUUID(),

    eventType:
      "identity.user.created" as const,

    version:
      1 as const,

    producer:
      "identity-service" as const,

    occurredAt:
      new Date().toISOString(),

    aggregateId:
      crypto.randomUUID(),

    payload: {
      userId:
        crypto.randomUUID(),

      email:
        "contract@example.com",

      accountType:
        "USER" as const,
    },
  };
}

describe(
  "Identity event contracts",
  () => {
    describe(
      "identity.account.type.changed",
      () => {
        it(
          "accepts the supported V1 contract",
          () => {
            const event =
              buildAccountTypeChangedEvent();

            const result =
              AccountTypeChangedEventSchema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(true);

            if (
              !result.success
            ) {
              throw new Error(
                "Expected a valid V1 account type changed event",
              );
            }

            expect(
              result.data,
            ).toEqual(event);
          },
        );

        it(
          "accepts the V1 schema directly",
          () => {
            const event =
              buildAccountTypeChangedEvent();

            const result =
              AccountTypeChangedEventV1Schema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(true);
          },
        );

        it(
          "rejects an unsupported version",
          () => {
            const event = {
              ...buildAccountTypeChangedEvent(),

              version:
                2,
            };

            const result =
              AccountTypeChangedEventSchema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(false);
          },
        );

        it(
          "rejects an invalid event type",
          () => {
            const event = {
              ...buildAccountTypeChangedEvent(),

              eventType:
                "identity.user.created",
            };

            const result =
              AccountTypeChangedEventSchema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(false);
          },
        );

        it(
          "rejects an invalid producer",
          () => {
            const event = {
              ...buildAccountTypeChangedEvent(),

              producer:
                "profile-service",
            };

            const result =
              AccountTypeChangedEventSchema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(false);
          },
        );

        it(
        "rejects an invalid account type",
        () => {
            const event =
                buildAccountTypeChangedEvent();

                const invalidEvent = {
                ...event,

                payload: {
                    ...event.payload,

                    newAccountType:
                    "ADMIN",
                },
                };

                const result =
                AccountTypeChangedEventSchema.safeParse(
                    invalidEvent,
                );

                expect(
                result.success,
                ).toBe(false);
            },
        );

        it(
          "rejects extra top-level fields",
          () => {
            const event = {
              ...buildAccountTypeChangedEvent(),

              newField:
                "should-not-be-accepted",
            };

            const result =
              AccountTypeChangedEventSchema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(false);
          },
        );

        it(
          "rejects extra payload fields",
          () => {
            const event = {
              ...buildAccountTypeChangedEvent(),

              payload: {
                ...buildAccountTypeChangedEvent()
                  .payload,

                accountName:
                  "Unexpected field",
              },
            };

            const result =
              AccountTypeChangedEventSchema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(false);
          },
        );

        it(
          "rejects missing previousAccountType",
          () => {
            const event =
              buildAccountTypeChangedEvent();

            const invalidEvent = {
              ...event,

              payload: {
                userId:
                  event.payload.userId,

                newAccountType:
                  event.payload
                    .newAccountType,
              },
            };

            const result =
              AccountTypeChangedEventSchema.safeParse(
                invalidEvent,
              );

            expect(
              result.success,
            ).toBe(false);
          },
        );

        it(
          "rejects missing newAccountType",
          () => {
            const event =
              buildAccountTypeChangedEvent();

            const invalidEvent = {
              ...event,

              payload: {
                userId:
                  event.payload.userId,

                previousAccountType:
                  event.payload
                    .previousAccountType,
              },
            };

            const result =
              AccountTypeChangedEventSchema.safeParse(
                invalidEvent,
              );

            expect(
              result.success,
            ).toBe(false);
          },
        );
      },
    );

    describe(
      "identity.user.created",
      () => {
        it(
          "accepts the supported V1 contract",
          () => {
            const event =
              buildUserCreatedEvent();

            const result =
              UserCreatedEventSchema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(true);

            if (
              !result.success
            ) {
              throw new Error(
                "Expected a valid V1 user created event",
              );
            }

            expect(
              result.data,
            ).toEqual(event);
          },
        );

        it(
          "accepts the V1 schema directly",
          () => {
            const event =
              buildUserCreatedEvent();

            const result =
              UserCreatedEventV1Schema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(true);
          },
        );

        it(
          "rejects an unsupported version",
          () => {
            const event = {
              ...buildUserCreatedEvent(),

              version:
                2,
            };

            const result =
              UserCreatedEventSchema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(false);
          },
        );

        it(
          "rejects an invalid event type",
          () => {
            const event = {
              ...buildUserCreatedEvent(),

              eventType:
                "identity.account.type.changed",
            };

            const result =
              UserCreatedEventSchema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(false);
          },
        );

        it(
          "rejects an invalid email",
          () => {
            const event = {
              ...buildUserCreatedEvent(),

              payload: {
                ...buildUserCreatedEvent()
                  .payload,

                email:
                  "not-an-email",
              },
            };

            const result =
              UserCreatedEventSchema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(false);
          },
        );

        it(
          "rejects an invalid account type",
          () => {
            const event = {
              ...buildUserCreatedEvent(),

              payload: {
                ...buildUserCreatedEvent()
                  .payload,

                accountType:
                  "ADMIN",
              },
            };

            const result =
              UserCreatedEventSchema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(false);
          },
        );

        it(
          "rejects extra top-level fields",
          () => {
            const event = {
              ...buildUserCreatedEvent(),

              unexpected:
                true,
            };

            const result =
              UserCreatedEventSchema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(false);
          },
        );

        it(
          "rejects extra payload fields",
          () => {
            const event = {
              ...buildUserCreatedEvent(),

              payload: {
                ...buildUserCreatedEvent()
                  .payload,

                username:
                  "unexpected",
              },
            };

            const result =
              UserCreatedEventSchema.safeParse(
                event,
              );

            expect(
              result.success,
            ).toBe(false);
          },
        );
      },
    );
  },
);