import type {
  AccountType,
} from "@talent/contracts";

const UPGRADE_TRANSITIONS: Record<
  AccountType,
  readonly AccountType[]
> = {
  USER: [
    "TALENT",
    "PROFESSIONAL",
  ],
  TALENT: [
    "PROFESSIONAL",
  ],
  PROFESSIONAL: [],
};

export function isAccountUpgradeAllowed(
  currentAccountType: AccountType,
  targetAccountType: AccountType,
): boolean {
  return UPGRADE_TRANSITIONS[
    currentAccountType
  ].includes(targetAccountType);
}