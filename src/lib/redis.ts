import { GetDraftType } from "@/schema/v1/floor/floor.schema";
import { client } from "./db-redis";
import { prisma } from "./prisma";

export async function pushTheFloorDraftInTheQueue(jobName: string, data: GetDraftType) {
  try {
    if (!client.isOpen) {
      await client.connect();
    }

    // it will give the Unique value
    const jobId = await client.incr("counters:floor_job_id");

    const payload = JSON.stringify({
      jobId,
      ...data,
    });

    // pushing into queue
    await client.lPush(jobName, payload);

    // updating the asyncJobId , asyncJobtype and asyncJobStatus
    await prisma.floor.update({
      where: {
        id: data.floorId,
      },
      data: {
        asyncJobType: jobName,
        asyncJobId: jobId,
        asyncJobStatus: "PENDING",
      },
    });

    return jobId;
  } catch (error) {
    console.error("Failed to push floor draft to queue:", error);
    throw error;
  }
}
