/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "units" TEXT NOT NULL DEFAULT 'feet',
    "language" TEXT NOT NULL DEFAULT 'en',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "buildingType" TEXT NOT NULL DEFAULT 'residential',
    "totalFloors" INTEGER NOT NULL DEFAULT 1,
    "activeFloorNumber" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlotConfiguration" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "shapeType" TEXT NOT NULL DEFAULT 'rectangle',
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "secondWidth" DOUBLE PRECISION,
    "secondHeight" DOUBLE PRECISION,
    "totalArea" DOUBLE PRECISION NOT NULL,
    "customPoints" JSONB,
    "northFacing" BOOLEAN NOT NULL DEFAULT true,
    "cornerPlot" BOOLEAN NOT NULL DEFAULT false,
    "slopedPlot" BOOLEAN NOT NULL DEFAULT false,
    "obstacles" TEXT,
    "plotImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlotConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Floor" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "floorNumber" INTEGER NOT NULL,
    "floorName" TEXT NOT NULL,
    "floorType" TEXT NOT NULL DEFAULT 'middle',
    "currentVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Floor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloorVersion" (
    "id" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "changeLog" TEXT NOT NULL,
    "changeType" TEXT NOT NULL DEFAULT 'initial',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FloorVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VersionMetadata" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL DEFAULT 'user',
    "userMessage" TEXT,
    "aiExplanation" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VersionMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirements" (
    "id" TEXT NOT NULL,
    "floorId" TEXT,
    "versionId" TEXT,
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "kitchen" BOOLEAN NOT NULL DEFAULT true,
    "livingRoom" BOOLEAN NOT NULL DEFAULT true,
    "plotWidth" DOUBLE PRECISION NOT NULL,
    "plotHeight" DOUBLE PRECISION NOT NULL,
    "totalArea" DOUBLE PRECISION NOT NULL,
    "budget" DOUBLE PRECISION,
    "roomTypes" TEXT[],
    "roomCount" INTEGER NOT NULL,
    "specialRooms" TEXT[],
    "constraints" TEXT[],
    "accessibility" BOOLEAN NOT NULL DEFAULT false,
    "preferredLayout" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloorPlan" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "plotWidth" DOUBLE PRECISION NOT NULL,
    "plotHeight" DOUBLE PRECISION NOT NULL,
    "totalArea" DOUBLE PRECISION NOT NULL,
    "utilization" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rooms" JSONB NOT NULL,
    "svgCode" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FloorPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "floorId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#E8F4F8',
    "doors" JSONB,
    "windows" JSONB,
    "adjacent" TEXT[],
    "priority" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostEstimate" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "materialCost" DOUBLE PRECISION NOT NULL,
    "laborCost" DOUBLE PRECISION NOT NULL,
    "contingency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "costPerSqft" DOUBLE PRECISION NOT NULL,
    "materialBreakdown" JSONB,
    "timeline" JSONB,
    "assumptions" TEXT,
    "location" TEXT,
    "quality" TEXT NOT NULL DEFAULT 'standard',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostEstimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildingSummary" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "totalBuildingArea" DOUBLE PRECISION NOT NULL,
    "totalBuildingCost" DOUBLE PRECISION NOT NULL,
    "allRoomTypes" TEXT[],
    "floorBreakdown" JSONB NOT NULL,
    "averageCostPerSqft" DOUBLE PRECISION,
    "estimatedTimeline" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuildingSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "extractedRequirements" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "floorId" TEXT,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "versionGenerated" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PlotConfiguration_projectId_key" ON "PlotConfiguration"("projectId");

-- CreateIndex
CREATE INDEX "Floor_projectId_idx" ON "Floor"("projectId");

-- CreateIndex
CREATE INDEX "Floor_floorNumber_idx" ON "Floor"("floorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Floor_projectId_floorNumber_key" ON "Floor"("projectId", "floorNumber");

-- CreateIndex
CREATE INDEX "FloorVersion_floorId_idx" ON "FloorVersion"("floorId");

-- CreateIndex
CREATE INDEX "FloorVersion_versionNumber_idx" ON "FloorVersion"("versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FloorVersion_floorId_versionId_key" ON "FloorVersion"("floorId", "versionId");

-- CreateIndex
CREATE UNIQUE INDEX "VersionMetadata_versionId_key" ON "VersionMetadata"("versionId");

-- CreateIndex
CREATE UNIQUE INDEX "Requirements_floorId_key" ON "Requirements"("floorId");

-- CreateIndex
CREATE UNIQUE INDEX "Requirements_versionId_key" ON "Requirements"("versionId");

-- CreateIndex
CREATE UNIQUE INDEX "FloorPlan_versionId_key" ON "FloorPlan"("versionId");

-- CreateIndex
CREATE INDEX "Room_floorId_idx" ON "Room"("floorId");

-- CreateIndex
CREATE UNIQUE INDEX "CostEstimate_versionId_key" ON "CostEstimate"("versionId");

-- CreateIndex
CREATE UNIQUE INDEX "BuildingSummary_projectId_key" ON "BuildingSummary"("projectId");

-- CreateIndex
CREATE INDEX "ChatSession_userId_idx" ON "ChatSession"("userId");

-- CreateIndex
CREATE INDEX "ChatSession_projectId_idx" ON "ChatSession"("projectId");

-- CreateIndex
CREATE INDEX "ChatMessage_sessionId_idx" ON "ChatMessage"("sessionId");

-- CreateIndex
CREATE INDEX "ChatMessage_floorId_idx" ON "ChatMessage"("floorId");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlotConfiguration" ADD CONSTRAINT "PlotConfiguration_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Floor" ADD CONSTRAINT "Floor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloorVersion" ADD CONSTRAINT "FloorVersion_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VersionMetadata" ADD CONSTRAINT "VersionMetadata_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "FloorVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirements" ADD CONSTRAINT "Requirements_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirements" ADD CONSTRAINT "Requirements_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "FloorVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloorPlan" ADD CONSTRAINT "FloorPlan_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "FloorVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostEstimate" ADD CONSTRAINT "CostEstimate_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "FloorVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildingSummary" ADD CONSTRAINT "BuildingSummary_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
