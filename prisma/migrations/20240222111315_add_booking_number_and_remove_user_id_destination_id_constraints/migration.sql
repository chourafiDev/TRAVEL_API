/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `Bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Bookings_userId_destinationId_key";

-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Bookings_number_key" ON "Bookings"("number");
