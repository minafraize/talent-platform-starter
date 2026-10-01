export const RateLimitPolicy = {
  loginIp: {
    limit: 20,
    windowSeconds: 60,
  },

  loginIdentifier: {
    limit: 5,
    windowSeconds: 60,
  },

  registerIp: {
    limit: 10,
    windowSeconds: 60,
  },
} as const;