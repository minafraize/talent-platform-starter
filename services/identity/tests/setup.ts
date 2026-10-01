import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../.env.test");

const result = dotenv.config({
  path: envPath,
  override: true,
});

if (result.error) {
  throw new Error(
    `Failed to load test environment from ${envPath}: ${result.error.message}`,
  );
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    `DATABASE_URL is missing after loading ${envPath}`,
  );
}