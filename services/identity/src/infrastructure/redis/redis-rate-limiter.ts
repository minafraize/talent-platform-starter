import { Redis } from "ioredis";

import type {
  RateLimitInput,
  RateLimitResult,
  RateLimiter,
} from "../../application/ports/rate-limiter.js";

const RATE_LIMIT_LUA = `
local current = redis.call("INCR", KEYS[1])

if current == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end

local ttl = redis.call("TTL", KEYS[1])

return { current, ttl }
`;

export class RedisRateLimiter
  implements RateLimiter
{
  constructor(
    private readonly redis: Redis,
  ) {}

  async check(
    input: RateLimitInput,
  ): Promise<RateLimitResult> {
    const result = (await this.redis.eval(
      RATE_LIMIT_LUA,
      1,
      input.key,
      input.windowSeconds,
    )) as [number | string, number | string];

    const current = Number(result[0]);
    const ttl = Math.max(0, Number(result[1]));

    const allowed =
      current <= input.limit;

    return {
      allowed,
      limit: input.limit,
      remaining: Math.max(
        0,
        input.limit - current,
      ),
      retryAfterSeconds: allowed
        ? ttl
        : Math.max(1, ttl),
    };
  }
}