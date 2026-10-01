import type { OutboxPublisher } from "../application/outbox/outbox-publisher.js";

export interface OutboxWorkerOptions {
  pollIntervalMs?: number;
}

const DEFAULT_POLL_INTERVAL_MS = 1_000;

/**
 * Long-running outbox polling loop.
 *
 * Guarantees:
 * - start() is idempotent.
 * - one publish cycle runs at a time.
 * - the next cycle is scheduled only after the current one finishes.
 * - stop() cancels the scheduled timer and waits for an in-flight cycle.
 * - a publishing failure does not kill the worker.
 */
export class OutboxWorker {
  private readonly pollIntervalMs: number;

  private running = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private cyclePromise: Promise<void> | null = null;

  constructor(
    private readonly publisher: OutboxPublisher,
    options: OutboxWorkerOptions = {},
  ) {
    const pollIntervalMs =
      options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;

    if (
      !Number.isFinite(pollIntervalMs) ||
      pollIntervalMs < 0
    ) {
      throw new Error(
        "pollIntervalMs must be a finite non-negative number",
      );
    }

    this.pollIntervalMs = pollIntervalMs;
  }

  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    void this.runCycle();
  }

  async stop(): Promise<void> {
    this.running = false;
    this.clearScheduledTimer();

    const cycle = this.cyclePromise;

    if (cycle) {
      await cycle;
    }
  }

  private async runCycle(): Promise<void> {
    if (!this.running || this.cyclePromise) {
      return;
    }

    const cycle = this.executeCycle();
    this.cyclePromise = cycle;

    try {
      await cycle;
    } finally {
      if (this.cyclePromise === cycle) {
        this.cyclePromise = null;
      }
    }
  }

  private async executeCycle(): Promise<void> {
    try {
      await this.publisher.publishPending();
    } catch (error) {
      console.error(
        JSON.stringify({
          message: "Outbox publishing cycle failed",
          error:
            error instanceof Error
              ? error.message
              : String(error),
        }),
      );
    }

    if (this.running) {
      this.scheduleNextCycle();
    }
  }

  private scheduleNextCycle(): void {
    this.clearScheduledTimer();

    this.timer = setTimeout(() => {
      this.timer = null;
      void this.runCycle();
    }, this.pollIntervalMs);
  }

  private clearScheduledTimer(): void {
    if (this.timer === null) {
      return;
    }

    clearTimeout(this.timer);
    this.timer = null;
  }
}
