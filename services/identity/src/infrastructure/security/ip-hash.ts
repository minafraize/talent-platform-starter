import { createHash } from "node:crypto";

export function hashIp(ip: string): string {
  const pepper = process.env.IP_HASH_SECRET;

  if (!pepper) {
    throw new Error(
      "IP_HASH_SECRET is not defined",
    );
  }

  return createHash("sha256")
    .update(`${pepper}:${ip}`)
    .digest("hex");
}