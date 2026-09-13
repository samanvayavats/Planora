import { NextRequest, NextResponse } from "next/server";
import { FloorAndRequirementsFloorVersionSchema } from "@/schema/v1/floor/floor.schema";
import {
  createFloorRequirementsAndFloorVerions,
  getParticularFloor,
} from "@/services/floor/floor.service";

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const floorId = searchParams.get("floorId");

    if (!floorId) {
      return NextResponse.json(
        {
          message: "floorId is required",
        },
        { status: 400 },
      );
    }

    const floor = await getParticularFloor(floorId);

    if (!floor) {
      return NextResponse.json(
        {
          message: "Can't fetch the current floor",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "floor fetched",
        data: floor,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("error at the time fetching the current floor", error);
    return NextResponse.json(
      {
        message: "Can't fetch the current floor",
      },
      { status: 500 },
    );
  }
}
