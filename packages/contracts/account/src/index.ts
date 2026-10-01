export const ACCOUNT_TYPES = [
  "USER",
  "TALENT",
  "PROFESSIONAL",
] as const;

export type AccountType =
  (typeof ACCOUNT_TYPES)[number];