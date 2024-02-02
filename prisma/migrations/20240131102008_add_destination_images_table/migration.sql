/*
  Warnings:

  - You are about to drop the column `imagesPublicId` on the `Destination` table. All the data in the column will be lost.
  - You are about to drop the column `imagesUrl` on the `Destination` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "imagesPublicId",
DROP COLUMN "imagesUrl";

-- CreateTable
CREATE TABLE "DestinationImages" (
    "id" SERIAL NOT NULL,
    "imagesUrl" TEXT NOT NULL,
    "imagesPublicId" TEXT NOT NULL,
    "destinationId" INTEGER NOT NULL,

    CONSTRAINT "DestinationImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DestinationImages" ADD CONSTRAINT "DestinationImages_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
