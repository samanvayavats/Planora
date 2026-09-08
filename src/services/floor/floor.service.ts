import { prisma } from "@/lib/prisma";
import { FloorAndRequirementsFloorVersionType } from "@/schema/v1/floor/floor.schema";

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
