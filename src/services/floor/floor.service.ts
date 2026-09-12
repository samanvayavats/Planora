import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { FloorAndRequirementsFloorVersionType, GetDraftType } from "@/schema/v1/floor/floor.schema";
import { generateFloorPlanData } from "@/lib/ai";
import { PlotConfigurationTypePlotConfigurationTypeCombined } from "@/schema/v1/project/project.schema";
import { AiPayloadDataType, AiResponseType } from "@/schema/v1/ai/ai.schema";

export async function createFloorRequirementsAndFloorVerions(
  data: FloorAndRequirementsFloorVersionType,
) {
  const result = await prisma.$transaction(async (tx) => {
    const floor = await tx.floor.create({
      data: {
        projectId: data.projectId,
        floorNumber: data.floorNumber,
        floorName: data.floorName,
        floorType: data.currentVersionId,
        asyncJobType: data.asyncJobType,
        asyncJobStatus: data.asyncJobStatus,
      },
    });

    const floorVersion = await tx.floorVersion.create({
      data: {
        floorId: floor.id,
        versionId: data.versionId,
        versionNumber: data.versionNumber,
        changeLog: data.changeLog,
      },
    });

    const updateCurrentVersionId = await tx.floor.update({
      where: {
        id: floor.id,
      },
      data: {
        currentVersionId: floorVersion.id,
      },
    });

    const requirements = await tx.requirements.create({
      data: {
        floorId: floor.id,
        versionId: floorVersion.id,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        kitchen: data.kitchen,
        livingRoom: data.kitchen,
        plotWidth: data.plotWidth,
        plotHeight: data.plotHeight,
        totalArea: data.totalArea,
        budget: data.budget,
        roomTypes: data.roomTypes,
        roomCount: data.roomCount,
        specialRooms: data.specialRooms,
        accessibility: data.accessibility,
        constraints: data.constraints,
        notes: data.notes,
      },
    });

    return { floor, floorVersion, requirements };
  });

  return result;
}

export async function getDraftFromAi(body: GetDraftType) {
  const { projectId, floorId, versionId } = body;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      plotConfiguration: true,
    },
  });

  if (!project || !project.plotConfiguration) {
    throw new Error(`Project not found or plot configuration missing for projectId: ${projectId}`);
  }

  const projectConfig =
    project.plotConfiguration as unknown as PlotConfigurationTypePlotConfigurationTypeCombined;

  const floor = await prisma.floor.findUnique({
    where: {
      id: floorId,
      projectId: projectId,
      currentVersionId: versionId,
    },
    select: {
      versions: true,
      requirements: true,
    },
  });

  if (!floor || !floor.requirements || !floor.versions) {
    throw new Error(
      `Floor not found for floorId: ${floorId}, projectId: ${projectId}, versionId: ${versionId}`,
    );
  }

  const floorConfig = (floor.requirements &&
    floor.versions) as unknown as FloorAndRequirementsFloorVersionType;
  const rawResult: AiPayloadDataType = await generateFloorPlanData(projectConfig, floorConfig);

  return rawResult;
}

export async function storeTheAiResponseInDataBase(aiData: AiPayloadDataType, ids: GetDraftType) {
  // 1. Precompute derived cost metrics
  const totalCost =
    aiData.costEstimate.materialCost +
    aiData.costEstimate.laborCost +
    aiData.costEstimate.contingency;

  const costPerSqft =
    aiData.floorPlan.totalArea > 0
      ? Number((totalCost / aiData.floorPlan.totalArea).toFixed(2))
      : 0;

  // 2. Perform transactional database writes
  await prisma.$transaction(async (tx) => {
    // Save FloorPlan record
    await tx.floorPlan.create({
      data: {
        versionId: ids.versionId,
        plotWidth: aiData.floorPlan.plotWidth,
        plotHeight: aiData.floorPlan.plotHeight,
        totalArea: aiData.floorPlan.totalArea,
        utilization: aiData.floorPlan.utilization,
        svgCode: aiData.floorPlan.svgCode,
        rooms: aiData.rooms as unknown as Prisma.InputJsonValue,
        generatedAt: new Date(),
      },
    });

    // Save all Room records in parallel within the transaction
    await Promise.all(
      aiData.rooms.map((room) =>
        tx.room.create({
          data: {
            floorId: ids.floorId,
            roomId: room.roomId,
            type: room.type,
            area: room.area,
            width: room.width,
            height: room.height,
            x: room.x,
            y: room.y,
            color: room.color,
            doors: (room.doors ?? Prisma.JsonNull) as Prisma.InputJsonValue,
            windows: (room.windows ?? Prisma.JsonNull) as Prisma.InputJsonValue,
            adjacent: room.adjacent,
            priority: room.priority,
          },
        }),
      ),
    );

    // Save CostEstimate record
    await tx.costEstimate.create({
      data: {
        versionId: ids.versionId,
        materialCost: aiData.costEstimate.materialCost,
        laborCost: aiData.costEstimate.laborCost,
        contingency: aiData.costEstimate.contingency,
        totalCost: totalCost,
        costPerSqft: costPerSqft,
        materialBreakdown: (aiData.costEstimate.materialBreakdown ??
          Prisma.JsonNull) as Prisma.InputJsonValue,
        timeline: (aiData.costEstimate.timeline ?? Prisma.JsonNull) as Prisma.InputJsonValue,
        location: aiData.costEstimate.location ?? null,
        quality: aiData.costEstimate.quality,
        assumptions: aiData.costEstimate.assumptions ?? null,
      },
    });
  });

  // 3. Fetch and return the updated floor record
  const floorGenerated = await prisma.floor.findUnique({
    where: {
      id: ids.floorId,
      currentVersionId: ids.versionId,
    },
    select: {
      rooms: true,
      versions: {
        where: {
          id: ids.versionId,
        },
        select: {
          floorPlan: true,
          costEstimate: true,
        },
      },
    },
  });

  return floorGenerated;
}
