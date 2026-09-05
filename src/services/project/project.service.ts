import { prisma } from "@/lib/prisma";
import { PlotConfigurationTypePlotConfigurationTypeCombined } from "@/schema/v1/project/project.schema";

export async function createProjectPlotConfiguration(
  data: PlotConfigurationTypePlotConfigurationTypeCombined,
) {
  const result = await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        totalFloors: data.totalFloors,
        activeFloorNumber: data.activeFloorNumber,
        status: data.status,
        isPublic: data.isPublic,
      },
    });

    const plotConfig = await tx.plotConfiguration.create({
      data: {
        projectId: project?.id,
        shapeType: data.shapeType,
        width: data.width,
        height: data.height,
        secondWidth: data.secondWidth,
        secondHeight: data.height,
        totalArea: data.totalArea,
        northFacing: data.northFacing,
        cornerPlot: data.cornerPlot,
        slopedPlot: data.slopedPlot,
        obstacles: data.obstacles,
        plotImageUrl: data.plotImageUrl,
      },
    });

    return { project, plotConfig };
  });

  return result;
}
