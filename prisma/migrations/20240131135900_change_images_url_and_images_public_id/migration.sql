/*
  Warnings:

  - You are about to drop the column `imagesPublicId` on the `DestinationImages` table. All the data in the column will be lost.
  - You are about to drop the column `imagesUrl` on the `DestinationImages` table. All the data in the column will be lost.
  - Added the required column `imagePublicId` to the `DestinationImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `DestinationImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DestinationImages" DROP COLUMN "imagesPublicId",
DROP COLUMN "imagesUrl",
ADD COLUMN     "imagePublicId" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL;
