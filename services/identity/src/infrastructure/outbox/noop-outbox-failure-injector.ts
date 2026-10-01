import type { OutboxFailureInjector } from "../../application/ports/outbox-failure.js";

export class NoopOutboxFailureInjector
  implements OutboxFailureInjector
{
  shouldFail(): boolean {
    return false;
  }
}