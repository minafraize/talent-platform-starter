import type { Producer } from "kafkajs";

import { kafka } from "./kafka-client.js";

import type {
  EventPublisher,
  PublishEventInput,
} from "../../application/ports/event-publisher.js";

export class KafkaEventPublisher
  implements EventPublisher
{
  private readonly producer: Producer;
  private connected = false;

  constructor() {
    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    await this.producer.connect();
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    await this.producer.disconnect();
    this.connected = false;
  }

  async publish(
    input: PublishEventInput,
  ): Promise<void> {
    await this.connect();

    await this.producer.send({
      topic: input.topic,
      messages: [
        {
          key: input.key,
          value: JSON.stringify(input.event),
        },
      ],
    });
  }
}