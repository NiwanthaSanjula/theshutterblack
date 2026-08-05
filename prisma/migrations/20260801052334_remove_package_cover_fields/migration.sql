/*
  Warnings:

  - You are about to drop the column `coverPublicId` on the `service_packages` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `service_packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "service_packages" DROP COLUMN "coverPublicId",
DROP COLUMN "coverUrl";
