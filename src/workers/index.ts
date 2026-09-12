import { client } from "@/lib/db-redis";
import { prisma } from "@/lib/prisma";
import { GetDraftType } from "@/schema/v1/floor/floor.schema";
import { AiPayloadDataType } from "@/schema/v1/ai/ai.schema";
import { getDraftFromAi, storeTheAiResponseInDataBase } from "@/services/floor/floor.service";

async function main(): Promise<void> {
  if (!client.isOpen) {
    await client.connect();
  }

  while (true) {
    let data: GetDraftType | null = null;

    try {
      const draft = await client.brPop("get-draft", 0);
      if (!draft?.element) continue;

      // get the element
      data = JSON.parse(draft.element) as GetDraftType;

      // update the asyncJobStatus as processing
      await prisma.floor.update({
        where: { id: data.floorId },
        data: { asyncJobStatus: "PROCESSING" },
      });

      // getting the data from the ai
      const aiResult: AiPayloadDataType = await getDraftFromAi(data);
      if (!aiResult) {
        throw new Error("Invalid AI response: Generation returned empty result");
      }

      // storing the data from ai in the db
      const result = await storeTheAiResponseInDataBase(aiResult, data);
      if (!result) {
        throw new Error("Failed to persist AI response in database");
      }

      // update the asyncJobStatus as completed
      await prisma.floor.update({
        where: { id: data.floorId },
        data: { asyncJobStatus: "COMPLETED" },
      });
    } catch (err) {
      console.error("Error processing draft job:", err);

      // if creating the draft failed update the asyncJobStatus as failed
      if (data?.floorId) {
        try {
          await prisma.floor.update({
            where: { id: data.floorId },
            data: { asyncJobStatus: "FAILED" },
          });
        } catch (dbErr) {
          console.error("Failed to mark job as FAILED in DB:", dbErr);
        }
      }
    }
  }
}

main().catch((err) => {
  console.error("Fatal error in worker main loop:", err);
  process.exit(1);
});
