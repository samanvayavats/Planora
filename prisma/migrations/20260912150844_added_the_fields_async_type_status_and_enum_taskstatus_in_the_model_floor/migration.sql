/*
  Warnings:

  - Added the required column `asyncType` to the `Floor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Floor" ADD COLUMN     "asyncType" TEXT NOT NULL,
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'PENDING';
