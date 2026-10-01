export interface OutboxEventInput {
  eventId: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: unknown;
}

export interface OutboxWriter {
  create(
    input: OutboxEventInput,
  ): Promise<void>;
}