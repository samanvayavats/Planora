import { NextRequest, NextResponse } from "next/server";
import { PlotConfigurationSchemaPlotConfigurationSchemaCombined } from "@/schema/v1/project/project.schema";
import {
  createProjectPlotConfiguration,
  getAllFloorsOfTheParticularProject,
} from "@/services/project/project.service";

export async function POST(request: NextRequest) {
  try {
    const combined = await request.json();
    const plotConfigAndProjectValidation =
      PlotConfigurationSchemaPlotConfigurationSchemaCombined.safeParse(combined);

    if (!plotConfigAndProjectValidation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: plotConfigAndProjectValidation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { project, plotConfig } = await createProjectPlotConfiguration(
      plotConfigAndProjectValidation.data,
    );

    if (!project || !plotConfig) {
      return NextResponse.json(
        {
          message: "Project configuration failed",
        },
        { status: 500 },
      );
    }

    const data = Object.assign({}, project, plotConfig);

    if (!data) {
      return NextResponse.json(
        {
          message: "Project configuration failed",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Project registed configuration passed",
        data: data,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Project configuration and registration failed",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    if (!projectId) {
      return NextResponse.json(
        {
          message: "floorId is required",
        },
        { status: 400 },
      );
    }

    const project = await getAllFloorsOfTheParticularProject(projectId, page, pageSize);

    if (!project) {
      return NextResponse.json(
        {
          message: "Project not found",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      project: { id: project.id, name: project.title },
      floors: project.floors,
      totalFloors: project._count.floors,
    });
  } catch (error) {
    console.error("project not found ", error);

    return NextResponse.json(
      {
        message: "Project not found",
      },
      { status: 500 },
    );
  }
}
