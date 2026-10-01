import { randomUUID } from "node:crypto";

export function createOutboxWorkerId(): string {
  return `identity-outbox-${randomUUID()}`;
}