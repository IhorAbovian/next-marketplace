/*
  Warnings:

  - You are about to drop the column `location` on the `Listing` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "location";
