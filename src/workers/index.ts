import { client } from "@/lib/db-redis";
import { prisma } from "@/lib/prisma";

import { getDraftFromAi, storeTheAiResponseInDataBase } from "@/services/floor/floor.service";

import { AiPayloadDataType } from "@/schema/v1/ai/ai.schema";
import { GetDraftType } from "@/schema/v1/floor/floor.schema";

async function main(): Promise<void> {
  if (!client.isOpen) {
    await client.connect();
  }

  console.log("🚀 Floor draft worker started");

  while (true) {
    let data:
      | (GetDraftType & {
          jobId?: number;
        })
      | null = null;

    try {
      // --------------------------------------------------
      // 1. Wait for a job
      // --------------------------------------------------

      const draft = await client.brPop("get-draft", 0);

      if (!draft?.element) {
        continue;
      }

      // --------------------------------------------------
      // 2. Parse Redis payload
      // --------------------------------------------------

      data = JSON.parse(draft.element) as GetDraftType & {
        jobId?: number;
      };

      console.log("📥 Job received:", data.jobId);

      console.log("📐 Floor:", data.floorId);

      // --------------------------------------------------
      // 3. Mark job as PROCESSING
      // --------------------------------------------------

      await prisma.floor.update({
        where: {
          id: data.floorId,
        },
        data: {
          asyncJobStatus: "PROCESSING",
        },
      });

      console.log("🤖 Generating floor plan with Gemini...");

      // --------------------------------------------------
      // 4. Call Gemini
      // --------------------------------------------------

      const aiResult: AiPayloadDataType = await getDraftFromAi(data);

      if (!aiResult) {
        throw new Error("Invalid AI response: Generation returned empty result");
      }

      console.log("✅ Gemini generation completed");

      // --------------------------------------------------
      // 5. Store AI response
      // --------------------------------------------------

      console.log("💾 Storing AI response in database...");

      const result = await storeTheAiResponseInDataBase(aiResult, data);

      if (!result) {
        throw new Error("Failed to persist AI response in database");
      }

      console.log("✅ AI response stored in database");

      // --------------------------------------------------
      // 6. Mark job COMPLETED
      // --------------------------------------------------

      await prisma.floor.update({
        where: {
          id: data.floorId,
        },
        data: {
          asyncJobStatus: "COMPLETED",
        },
      });

      console.log(`🎉 Job ${data.jobId} completed`);
    } catch (error) {
      console.error("❌ Error processing draft job:", error);

      // --------------------------------------------------
      // 7. Mark job FAILED
      // --------------------------------------------------

      if (data?.floorId) {
        try {
          await prisma.floor.update({
            where: {
              id: data.floorId,
            },
            data: {
              asyncJobStatus: "FAILED",
            },
          });
        } catch (dbError) {
          console.error("Failed to mark job as FAILED:", dbError);
        }
      }
    }
  }
}

main().catch((error) => {
  console.error("Fatal worker error:", error);

  process.exit(1);
});
