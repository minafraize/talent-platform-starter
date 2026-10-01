-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('USER', 'TALENT', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "TalentProfileStatus" AS ENUM ('ACTIVE', 'CONVERTED');

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "AccountType" NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "username" TEXT,
    "displayName" TEXT,
    "bio" TEXT,
    "avatarMediaId" TEXT,
    "countryCode" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_profiles" (
    "id" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "status" "TalentProfileStatus" NOT NULL DEFAULT 'ACTIVE',
    "score" INTEGER NOT NULL DEFAULT 0,
    "convertedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "talent_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_profiles" (
    "id" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "headline" TEXT,
    "organization" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processed_events" (
    "eventId" UUID NOT NULL,
    "eventType" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_events_pkey" PRIMARY KEY ("eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_userId_key" ON "accounts"("userId");

-- CreateIndex
CREATE INDEX "accounts_type_status_idx" ON "accounts"("type", "status");

-- CreateIndex
CREATE INDEX "accounts_createdAt_idx" ON "accounts"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_accountId_key" ON "profiles"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");

-- CreateIndex
CREATE INDEX "profiles_countryCode_idx" ON "profiles"("countryCode");

-- CreateIndex
CREATE INDEX "profiles_createdAt_idx" ON "profiles"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "talent_profiles_accountId_key" ON "talent_profiles"("accountId");

-- CreateIndex
CREATE INDEX "talent_profiles_status_idx" ON "talent_profiles"("status");

-- CreateIndex
CREATE INDEX "talent_profiles_score_idx" ON "talent_profiles"("score");

-- CreateIndex
CREATE UNIQUE INDEX "professional_profiles_accountId_key" ON "professional_profiles"("accountId");

-- CreateIndex
CREATE INDEX "processed_events_eventType_processedAt_idx" ON "processed_events"("eventType", "processedAt");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_profiles" ADD CONSTRAINT "talent_profiles_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_profiles" ADD CONSTRAINT "professional_profiles_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
