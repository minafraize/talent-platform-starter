-- DropIndex
DROP INDEX "outbox_events_publishedAt_createdAt_idx";

-- AlterTable
ALTER TABLE "outbox_events" ADD COLUMN     "claimedAt" TIMESTAMP(3),
ADD COLUMN     "claimedBy" TEXT,
ADD COLUMN     "failedAt" TIMESTAMP(3),
ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "nextAttemptAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "outbox_events_publishedAt_nextAttemptAt_createdAt_idx" ON "outbox_events"("publishedAt", "nextAttemptAt", "createdAt");

-- CreateIndex
CREATE INDEX "outbox_events_claimedAt_idx" ON "outbox_events"("claimedAt");

-- CreateIndex
CREATE INDEX "outbox_events_claimedBy_idx" ON "outbox_events"("claimedBy");
