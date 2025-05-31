-- DropForeignKey
ALTER TABLE "BackupItem" DROP CONSTRAINT "BackupItem_databaseId_fkey";

-- DropForeignKey
ALTER TABLE "ExportItem" DROP CONSTRAINT "ExportItem_databaseId_fkey";

-- DropForeignKey
ALTER TABLE "QueryHistoryItem" DROP CONSTRAINT "QueryHistoryItem_databaseId_fkey";

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "apiKey" DROP NOT NULL,
ALTER COLUMN "apiSecret" DROP NOT NULL,
ALTER COLUMN "apiUrl" DROP NOT NULL;
