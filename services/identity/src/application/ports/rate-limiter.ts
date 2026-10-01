export interface RateLimitInput {
  key: string;
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check(
    input: RateLimitInput,
  ): Promise<RateLimitResult>;
}