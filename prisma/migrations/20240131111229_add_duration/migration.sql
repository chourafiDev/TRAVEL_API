/*
  Warnings:

  - Added the required column `duration` to the `Destination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "duration" INTEGER NOT NULL;
