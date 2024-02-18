/*
  Warnings:

  - The primary key for the `Favorite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,destinationId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_pkey",
ADD CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_destinationId_key" ON "Favorite"("userId", "destinationId");
