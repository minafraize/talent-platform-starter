-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('USER', 'TALENT', 'PROFESSIONAL');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'USER';
