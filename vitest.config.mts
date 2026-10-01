import { defineConfig } from "vitest";

export default defineConfig({
  test: {
    globals: true,
    passWithNoTests: true,
    environment: "node",

    setupFiles: [
      "./services/identity/tests/setup.ts",
    ],
  },
});