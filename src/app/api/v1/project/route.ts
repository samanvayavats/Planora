import { NextRequest, NextResponse } from "next/server";
import { PlotConfigurationSchemaPlotConfigurationSchemaCombined } from "@/schema/v1/project/project.schema";
import { createProjectPlotConfiguration } from "@/services/project/project.service";

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
