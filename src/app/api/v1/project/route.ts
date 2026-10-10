import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PlotConfigurationSchemaPlotConfigurationSchemaCombined } from "@/schema/v1/project/project.schema";
import {
  createProjectPlotConfiguration,
  getAllFloorsOfTheParticularProject,
} from "@/services/project/project.service";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized. Please sign in to configure a project.",
        },
        { status: 401 },
      );
    }

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

    const projectPayload = {
      ...plotConfigAndProjectValidation.data,
      userId: session.user.id,
    };

    const { project, plotConfig } = await createProjectPlotConfiguration(projectPayload);

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized. Please sign in to view project details.",
        },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        {
          message: "floorId is required",
        },
        { status: 400 },
      );
    }

    const project = await getAllFloorsOfTheParticularProject(projectId);

    if (!project) {
      return NextResponse.json(
        {
          message: "Project not found",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      data: project,
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
