import { NextRequest, NextResponse } from "next/server";
import { getDraftFromAi, storeTheAiResponseInDataBase } from "@/services/floor/floor.service";
import { GetDraftSchema } from "@/schema/v1/floor/floor.schema";
import { AiPayloadDataType } from "@/schema/v1/ai/ai.schema";
import { pushTheFloorDraftInTheQueue } from "@/lib/redis";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const bodyValidation = GetDraftSchema.safeParse(body);

    if (!bodyValidation.success) {
      return NextResponse.json(
        {
          message: "get draft validation failed",
        },
        { status: 400 },
      );
    }

    const jobId = await pushTheFloorDraftInTheQueue("get-draft", bodyValidation.data);

    if (!jobId) {
      return NextResponse.json(
        {
          message: "Pushing the draft in queue failed",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "SVG generated",
        data: jobId,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: " SVG generation failed",
      },
      { status: 500 },
    );
  }
}
