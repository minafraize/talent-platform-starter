export interface RetryPolicyOptions {
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitterRatio?: number;
  maxAttempts?: number;
}

export class OutboxRetryPolicy {
  private readonly baseDelayMs: number;
  private readonly maxDelayMs: number;
  private readonly jitterRatio: number;
  readonly maxAttempts: number;

  constructor(options: RetryPolicyOptions = {}) {
    this.baseDelayMs = options.baseDelayMs ?? 1_000;
    this.maxDelayMs = options.maxDelayMs ?? 60_000;
    this.jitterRatio = options.jitterRatio ?? 0.2;
    this.maxAttempts = options.maxAttempts ?? 10;
  }

  getNextAttemptAt(
    attemptNumber: number,
    now = new Date(),
    random = Math.random,
  ): Date {
    const exponentialDelay = Math.min(
      this.maxDelayMs,
      this.baseDelayMs *
        2 ** Math.max(0, attemptNumber - 1),
    );

    const jitter =
      exponentialDelay *
      this.jitterRatio *
      random();

    return new Date(
      now.getTime() +
        exponentialDelay +
        jitter,
    );
  }
}