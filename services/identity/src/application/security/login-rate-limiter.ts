import {
  AppErrors,
  ErrorCode,
} from "@talent/errors";

import type { RateLimiter } from "../ports/rate-limiter.js";

import {
  RateLimitPolicy,
} from "./rate-limit-policy.js";

export interface LoginRateLimitInput {
  ipHash: string;
  identifier: string;
}

export class LoginRateLimiter {
  constructor(
    private readonly rateLimiter: RateLimiter,
  ) {}

  async check(
    input: LoginRateLimitInput,
  ): Promise<void> {
    const ipResult =
      await this.rateLimiter.check({
        key: `identity:ratelimit:login:ip:${input.ipHash}`,
        limit:
          RateLimitPolicy.loginIp.limit,
        windowSeconds:
          RateLimitPolicy.loginIp.windowSeconds,
      });

    if (!ipResult.allowed) {
      throw AppErrors.rateLimited(
        ErrorCode.RATE_LIMITED,
        "Too many login attempts",
        {
          retryAfterSeconds:
            ipResult.retryAfterSeconds,
        },
      );
    }

    const identifierResult =
      await this.rateLimiter.check({
        key:
          `identity:ratelimit:login:identifier:${input.identifier}`,
        limit:
          RateLimitPolicy.loginIdentifier
            .limit,
        windowSeconds:
          RateLimitPolicy.loginIdentifier
            .windowSeconds,
      });

    if (!identifierResult.allowed) {
      throw AppErrors.rateLimited(
        ErrorCode.RATE_LIMITED,
        "Too many login attempts",
        {
          retryAfterSeconds:
            identifierResult.retryAfterSeconds,
        },
      );
    }
  }
}