/*
  Warnings:

  - You are about to drop the column `subscribtionPeriod` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "subscribtionPeriod",
ADD COLUMN     "subscriptionPeriod" TIMESTAMP(3);
