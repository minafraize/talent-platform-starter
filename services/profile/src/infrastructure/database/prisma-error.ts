export function isUniqueConstraintError(
  error: unknown,
): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  return (
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}