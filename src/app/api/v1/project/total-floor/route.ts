import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProjectTotalFloors } from "@/services/project/project.service";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized. Please sign in.",
        },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        {
          message: "FloorId required",
        },
        { status: 400 },
      );
    }

    const totalFloors = await getProjectTotalFloors(projectId);

    if (!totalFloors) {
      return NextResponse.json(
        {
          message: " Total floor not available",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      data: totalFloors,
      message: " Total floor fetched ",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: " Total floor not available",
      },
      { status: 500 },
    );
  }
}
