import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 1. Get floorId
    const floorId = request.nextUrl.searchParams.get("floorId");

    if (!floorId) {
      return NextResponse.json(
        {
          message: "floorId is required",
        },
        { status: 400 },
      );
    }

    //  2. Fetch only what polling needs

    const floor = await prisma.floor.findUnique({
      where: {
        id: floorId,
      },

      select: {
        asyncJobId: true,
        asyncJobStatus: true,

        versions: {
          orderBy: {
            createdAt: "desc",
          },

          take: 1,

          select: {
            id: true,

            floorPlan: {
              select: {
                svgCode: true,
              },
            },
          },
        },
      },
    });

    if (!floor) {
      return NextResponse.json(
        {
          message: "Floor not found",
        },
        { status: 404 },
      );
    }

    //    3. Get latest version

    const latestVersion = floor.versions[0];

    const svgCode = latestVersion?.floorPlan?.svgCode ?? null;

    // 4. COMPLETED

    if (floor.asyncJobStatus === "COMPLETED" && svgCode) {
      return NextResponse.json({
        message: "Floor draft completed",

        data: {
          status: "COMPLETED",
          jobId: floor.asyncJobId,
          versionId: latestVersion?.id ?? null,
          svgCode,
        },
      });
    }

    // 5. PROCESSING

    if (floor.asyncJobStatus === "PROCESSING") {
      return NextResponse.json({
        message: "Floor draft is being generated",

        data: {
          status: "PROCESSING",
          jobId: floor.asyncJobId,
          svgCode: null,
        },
      });
    }

    // 6. PENDING

    if (floor.asyncJobStatus === "PENDING") {
      return NextResponse.json({
        message: "Floor draft is waiting in queue",

        data: {
          status: "PENDING",
          jobId: floor.asyncJobId,
          svgCode: null,
        },
      });
    }

    // 7. FAILED

    if (floor.asyncJobStatus === "FAILED") {
      return NextResponse.json({
        message: "Floor draft generation failed",

        data: {
          status: "FAILED",
          jobId: floor.asyncJobId,
          svgCode: null,

          error: "Blueprint generation failed. Please try again.",
        },
      });
    }

    // 8. Fallback

    if (svgCode) {
      return NextResponse.json({
        message: "Floor draft available",

        data: {
          status: "COMPLETED",
          jobId: floor.asyncJobId,
          versionId: latestVersion?.id ?? null,
          svgCode,
        },
      });
    }

    return NextResponse.json({
      message: "No floor draft available",

      data: {
        status: "IDLE",
        jobId: floor.asyncJobId,
        svgCode: null,
      },
    });
  } catch (error) {
    console.error("Floor draft polling error:", error);

    return NextResponse.json(
      {
        message: "Failed to check floor draft status",

        data: {
          status: "ERROR",
          svgCode: null,
          error: "Unable to check blueprint status",
        },
      },
      { status: 500 },
    );
  }
}
