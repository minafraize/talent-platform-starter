import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    passWithNoTests: true,

    setupFiles: ["./tests/setup.ts"],

    // Integration tests share the same PostgreSQL test database.
    // Run test files sequentially to prevent cross-test interference.
    fileParallelism: false,
  },
});