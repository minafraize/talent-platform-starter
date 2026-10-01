import {
  spawn,
  type ChildProcessWithoutNullStreams,
} from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(
  fileURLToPath(import.meta.url),
);

const identityServiceDir = resolve(
  currentDir,
  "../../../identity",
);

const STARTUP_TIMEOUT_MS = 10_000;
const SHUTDOWN_TIMEOUT_MS = 5_000;

function waitForExit(
  child: ChildProcessWithoutNullStreams,
): Promise<void> {
  if (child.exitCode !== null) {
    return Promise.resolve();
  }

  return new Promise((resolvePromise) => {
    const onExit = (): void => {
      resolvePromise();
    };

    child.once("exit", onExit);

    if (child.exitCode !== null) {
      child.off("exit", onExit);
      resolvePromise();
    }
  });
}

export async function startIdentityOutboxWorker(
  topic =
    process.env.KAFKA_PROFILE_TEST_TOPIC ??
    "identity.events.test",
): Promise<ChildProcessWithoutNullStreams> {
  const child = spawn(
    "pnpm",
    ["run", "worker:outbox"],
    {
      cwd: identityServiceDir,
      env: {
        ...process.env,
        NODE_ENV: "test",
        KAFKA_IDENTITY_TOPIC: topic,
      },
      stdio: [
        "ignore",
        "pipe",
        "pipe",
      ],
    },
  );

  let settled = false;
  let stdoutBuffer = "";

  const startupPromise =
    new Promise<void>((resolvePromise, rejectPromise) => {
      const timer = setTimeout(() => {
        if (settled) {
          return;
        }

        settled = true;
        rejectPromise(
          new Error(
            "Identity outbox worker did not start within 10 seconds",
          ),
        );
      }, STARTUP_TIMEOUT_MS);

      const rejectStartup = (
        error: Error,
      ): void => {
        if (settled) {
          return;
        }

        settled = true;
        clearTimeout(timer);
        rejectPromise(error);
      };

      child.once("error", (error) => {
        rejectStartup(error);
      });

      child.once("exit", (code, signal) => {
        rejectStartup(
          new Error(
            `Identity outbox worker exited before startup (code=${String(code)}, signal=${String(signal)})`,
          ),
        );
      });

      child.stdout.on("data", (chunk: Buffer | string) => {
        const output = chunk.toString();
        stdoutBuffer += output;

        process.stdout.write(
          `[identity-outbox] ${output}`,
        );

        if (
          stdoutBuffer.includes(
            "Identity outbox worker started",
          )
        ) {
          settled = true;
          clearTimeout(timer);
          resolvePromise();
        }
      });

      child.stderr.on("data", (chunk: Buffer | string) => {
        process.stderr.write(
          `[identity-outbox] ${chunk.toString()}`,
        );
      });
    });

  try {
    await startupPromise;
  } catch (error) {
    if (child.exitCode === null) {
      child.kill("SIGTERM");
    }

    await waitForExit(child);
    throw error;
  }

  return child;
}

export async function stopIdentityOutboxWorker(
  child:
  | ChildProcessWithoutNullStreams
  | undefined,
): Promise<void> {
  if (!child || child.exitCode !== null) {
    return;
  }

  child.kill("SIGTERM");

  let shutdownTimer: ReturnType<
    typeof setTimeout
  > | undefined;

  const exitPromise = waitForExit(child);

  const forceKillPromise =
    new Promise<void>((resolvePromise) => {
      shutdownTimer = setTimeout(() => {
        if (child.exitCode === null) {
          child.kill("SIGKILL");
        }
        resolvePromise();
      }, SHUTDOWN_TIMEOUT_MS);
    });

  try {
    await Promise.race([
      exitPromise,
      forceKillPromise,
    ]);
  } finally {
    if (shutdownTimer !== undefined) {
      clearTimeout(shutdownTimer);
    }
  }

  await waitForExit(child);
}
