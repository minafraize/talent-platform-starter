import {
  describe,
  expect,
  it,
} from "vitest";

import {
  isAccountUpgradeAllowed,
} from "../../../src/domain/account/account-type-transition.js";

describe(
  "Account type upgrade policy",
  () => {
    it("allows USER -> TALENT", () => {
      expect(
        isAccountUpgradeAllowed(
          "USER",
          "TALENT",
        ),
      ).toBe(true);
    });

    it("allows USER -> PROFESSIONAL", () => {
      expect(
        isAccountUpgradeAllowed(
          "USER",
          "PROFESSIONAL",
        ),
      ).toBe(true);
    });

    it("allows TALENT -> PROFESSIONAL", () => {
      expect(
        isAccountUpgradeAllowed(
          "TALENT",
          "PROFESSIONAL",
        ),
      ).toBe(true);
    });

    it("rejects USER -> USER", () => {
      expect(
        isAccountUpgradeAllowed(
          "USER",
          "USER",
        ),
      ).toBe(false);
    });

    it("rejects TALENT -> TALENT", () => {
      expect(
        isAccountUpgradeAllowed(
          "TALENT",
          "TALENT",
        ),
      ).toBe(false);
    });

    it("rejects PROFESSIONAL -> PROFESSIONAL", () => {
      expect(
        isAccountUpgradeAllowed(
          "PROFESSIONAL",
          "PROFESSIONAL",
        ),
      ).toBe(false);
    });

    it("rejects TALENT -> USER", () => {
      expect(
        isAccountUpgradeAllowed(
          "TALENT",
          "USER",
        ),
      ).toBe(false);
    });

    it("rejects PROFESSIONAL -> USER", () => {
      expect(
        isAccountUpgradeAllowed(
          "PROFESSIONAL",
          "USER",
        ),
      ).toBe(false);
    });

    it("rejects PROFESSIONAL -> TALENT", () => {
      expect(
        isAccountUpgradeAllowed(
          "PROFESSIONAL",
          "TALENT",
        ),
      ).toBe(false);
    });
  },
);