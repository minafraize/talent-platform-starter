import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { LoginRateLimiter } from "../../../src/application/security/login-rate-limiter.js";
import type {
  RateLimiter,
} from "../../../src/application/ports/rate-limiter.js";

describe("LoginRateLimiter", () => {
  it("allows requests under the limit", async () => {
    const rateLimiter: RateLimiter = {
      check: vi.fn()
        .mockResolvedValue({
          allowed: true,
          limit: 20,
          remaining: 19,
          retryAfterSeconds: 60,
        }),
    };

    const service =
      new LoginRateLimiter(
        rateLimiter,
      );

    await expect(
      service.check({
        ipHash: "ip-hash",
        identifier: "user@example.com",
      }),
    ).resolves.toBeUndefined();
  });

  it("rejects when the IP limit is exceeded", async () => {
    const rateLimiter: RateLimiter = {
      check: vi.fn()
        .mockResolvedValueOnce({
          allowed: false,
          limit: 20,
          remaining: 0,
          retryAfterSeconds: 42,
        }),
    };

    const service =
      new LoginRateLimiter(
        rateLimiter,
      );

    await expect(
      service.check({
        ipHash: "ip-hash",
        identifier: "user@example.com",
      }),
    ).rejects.toMatchObject({
      code: "RATE_LIMITED",
      statusCode: 429,
    });
  });
});