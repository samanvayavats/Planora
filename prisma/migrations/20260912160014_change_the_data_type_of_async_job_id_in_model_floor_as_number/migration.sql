/*
  Warnings:

  - The `asyncJobId` column on the `Floor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Floor" DROP COLUMN "asyncJobId",
ADD COLUMN     "asyncJobId" INTEGER;
