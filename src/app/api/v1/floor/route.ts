import { NextRequest, NextResponse } from "next/server";
import { FloorAndRequirementsFloorVersionSchema } from "@/schema/v1/floor/floor.schema";
import { createFloorRequirementsAndFloorVerions } from "@/services/floor/floor.service";
import { object } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const FloorAndRequirementsFloorVersionSchemaValidation =
      FloorAndRequirementsFloorVersionSchema.safeParse(body);

    if (!FloorAndRequirementsFloorVersionSchemaValidation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: FloorAndRequirementsFloorVersionSchemaValidation?.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { floor, floorVersion, requirements } = await createFloorRequirementsAndFloorVerions(
      FloorAndRequirementsFloorVersionSchemaValidation.data,
    );

    if (!floor || !floorVersion || !requirements) {
      return NextResponse.json(
        {
          message: "floor requirements failed",
        },
        { status: 500 },
      );
    }

    const data = Object.assign({}, floor, floorVersion, requirements);

    if (!data) {
      return NextResponse.json(
        {
          message: "floor requirements failed",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "floor requirements passed ",
        data: data,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "floor requirements failed",
      },
      { status: 500 },
    );
  }
}
