import { NextRequest, NextResponse } from "next/server";

import { GetDraftSchema } from "@/schema/v1/floor/floor.schema";
import { pushTheFloorDraftInTheQueue } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bodyValidation = GetDraftSchema.safeParse(body);

    if (!bodyValidation.success) {
      return NextResponse.json(
        {
          message: "Get draft validation failed",
          errors: bodyValidation.error.flatten(),
        },
        { status: 400 },
      );
    }

    // Queue the job

    const jobId = await pushTheFloorDraftInTheQueue("get-draft", bodyValidation.data);

    //  Return job ID

    return NextResponse.json(
      {
        message: "Floor draft job queued",
        data: {
          jobId,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get draft route error:", error);

    return NextResponse.json(
      {
        message: "Failed to queue floor draft",
      },
      { status: 500 },
    );
  }
}
