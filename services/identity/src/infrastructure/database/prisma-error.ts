import { Prisma } from "@prisma/client";

interface DriverAdapterError {
  kind?: string;
  cause?: {
    originalCode?: string;
    originalMessage?: string;
    kind?: string;
    constraint?: {
      index?: string;
    };
  };
}

interface PrismaMeta {
  target?: unknown;
  driverAdapterError?: DriverAdapterError;
}

export function isUniqueConstraintError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export function isLoginIdentifierUniqueViolation(
  error: Prisma.PrismaClientKnownRequestError,
): boolean {
  const meta = error.meta as PrismaMeta | undefined;

  if (!meta) {
    return false;
  }

  if (
    Array.isArray(meta.target) &&
    meta.target.includes("loginIdentifier")
  ) {
    return true;
  }

  return (
    meta.driverAdapterError?.cause?.constraint?.index ===
    "accounts_loginIdentifier_key"
  );
}