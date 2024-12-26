/*
  Warnings:

  - You are about to drop the column `fullName` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Provider` table. All the data in the column will be lost.
  - Added the required column `fullUserName` to the `Provider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerName` to the `Provider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Provider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "fullName",
DROP COLUMN "provider",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "fullUserName" TEXT NOT NULL,
ADD COLUMN     "providerName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
