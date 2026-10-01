import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "../../src/infrastructure/database/prisma";

describe("Identity Database", () => {
  it("connects to the test database", async () => {
    const result = await prisma.$queryRaw<
      Array<{ current_database: string }>
    >`
      SELECT current_database()
    `;

    expect(result[0]?.current_database).toBe(
      "talent_platform_test",
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});