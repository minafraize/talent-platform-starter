import {
  describe,
  expect,
  it,
} from "vitest";

import {
  OutboxRetryPolicy,
} from "../../../src/application/outbox/retry-policy";

describe("OutboxRetryPolicy", () => {
  const now = new Date(
    "2026-09-14T12:00:00.000Z",
  );

  it("calculates exponential backoff", () => {
    const policy =
      new OutboxRetryPolicy({
        baseDelayMs: 1_000,
        jitterRatio: 0,
      });

    expect(
      policy.getNextAttemptAt(1, now).getTime(),
    ).toBe(
      now.getTime() + 1_000,
    );

    expect(
      policy.getNextAttemptAt(2, now).getTime(),
    ).toBe(
      now.getTime() + 2_000,
    );

    expect(
      policy.getNextAttemptAt(3, now).getTime(),
    ).toBe(
      now.getTime() + 4_000,
    );

    expect(
      policy.getNextAttemptAt(4, now).getTime(),
    ).toBe(
      now.getTime() + 8_000,
    );
  });

  it("caps the delay", () => {
    const policy =
      new OutboxRetryPolicy({
        baseDelayMs: 1_000,
        maxDelayMs: 5_000,
        jitterRatio: 0,
      });

    expect(
      policy.getNextAttemptAt(10, now).getTime(),
    ).toBe(
      now.getTime() + 5_000,
    );
  });

  it("adds jitter", () => {
    const policy =
      new OutboxRetryPolicy({
        baseDelayMs: 1_000,
        jitterRatio: 0.2,
      });

    const result =
      policy.getNextAttemptAt(
        1,
        now,
        () => 0.5,
      );

    expect(
      result.getTime(),
    ).toBe(
      now.getTime() + 1_100,
    );
  });
});