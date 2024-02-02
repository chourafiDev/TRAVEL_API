/*
  Warnings:

  - You are about to drop the column `address` on the `Destination` table. All the data in the column will be lost.
  - Added the required column `destination` to the `Destination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "address",
ADD COLUMN     "destination" TEXT NOT NULL;
