import { Kafka } from "kafkajs";

const brokers = (process.env.KAFKA_BROKERS ?? "")
  .split(",")
  .map((broker) => broker.trim())
  .filter(Boolean);

if (brokers.length === 0) {
  throw new Error("KAFKA_BROKERS is not defined");
}

export const kafka = new Kafka({
  clientId:
    process.env.KAFKA_CLIENT_ID ??
    "identity-service",
  brokers,
});