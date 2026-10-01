import { kafkaProducer } from "../kafka/kafka.js";

let connected = false;

export async function connectEventPublisher() {
  if (connected) return;

  await kafkaProducer.connect();
  connected = true;
}

export async function publishEvent(
  topic: string,
  key: string,
  value: unknown,
) {
  await connectEventPublisher();

  await kafkaProducer.send({
    topic,
    messages: [
      {
        key,
        value: JSON.stringify(value),
      },
    ],
  });
}

export async function disconnectEventPublisher() {
  if (!connected) return;

  await kafkaProducer.disconnect();
  connected = false;
}
