-- DropIndex
DROP INDEX "Avatar_profileId_key";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "subscribtionPeriod" TIMESTAMP(3);
