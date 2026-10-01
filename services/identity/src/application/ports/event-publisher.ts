export interface PublishEventInput {
  topic: string;
  key: string;
  event: unknown;
}

export interface EventPublisher {
  publish(input: PublishEventInput): Promise<void>;
}