/*
  Warnings:

  - You are about to drop the column `asyncType` on the `Floor` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Floor` table. All the data in the column will be lost.
  - Added the required column `asyncJobType` to the `Floor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Floor" DROP COLUMN "asyncType",
DROP COLUMN "status",
ADD COLUMN     "asyncJobStatus" "TaskStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "asyncJobType" TEXT NOT NULL;
