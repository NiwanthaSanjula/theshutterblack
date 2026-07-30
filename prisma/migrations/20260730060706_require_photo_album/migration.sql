/*
  Warnings:

  - Made the column `albumId` on table `photos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "photos" ALTER COLUMN "albumId" SET NOT NULL;
