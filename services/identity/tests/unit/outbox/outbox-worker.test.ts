import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { OutboxWorker } from "../../../src/workers/outbox.worker";
import type { OutboxPublisher } from "../../../src/application/outbox/outbox-publisher";

describe("OutboxWorker", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts polling", async () => {
    vi.useFakeTimers();

    const publishPending = vi
      .fn<
        () => Promise<number>
      >()
      .mockResolvedValue(1);

    const publisher =
      {
        publishPending,
      } as unknown as OutboxPublisher;

    const worker =
      new OutboxWorker(
        publisher,
        {
          pollIntervalMs: 1_000,
        },
      );

    worker.start();

    await Promise.resolve();

    expect(publishPending).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1_000);

    expect(publishPending).toHaveBeenCalledTimes(2);

    await worker.stop();
  });

  it("does not start twice", async () => {
    vi.useFakeTimers();

    const publishPending = vi
      .fn<
        () => Promise<number>
      >()
      .mockResolvedValue(1);

    const publisher =
      {
        publishPending,
      } as unknown as OutboxPublisher;

    const worker =
      new OutboxWorker(
        publisher,
        {
          pollIntervalMs: 1_000,
        },
      );

    worker.start();
    worker.start();

    await Promise.resolve();

    await vi.advanceTimersByTimeAsync(1_000);

    expect(publishPending).toHaveBeenCalledTimes(2);

    await worker.stop();
  });

  it("stops polling", async () => {
    vi.useFakeTimers();

    const publishPending = vi
      .fn<
        () => Promise<number>
      >()
      .mockResolvedValue(1);

    const publisher =
      {
        publishPending,
      } as unknown as OutboxPublisher;

    const worker =
      new OutboxWorker(
        publisher,
        {
          pollIntervalMs: 1_000,
        },
      );

    worker.start();

    await Promise.resolve();

    await worker.stop();

    await vi.advanceTimersByTimeAsync(
      5_000,
    );

    expect(
      publishPending,
    ).toHaveBeenCalledTimes(1);
  });
});