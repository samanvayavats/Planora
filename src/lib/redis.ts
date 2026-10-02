import { createClient } from "redis";
import { prisma } from "@/lib/prisma";
import { GetDraftType } from "@/schema/v1/floor/floor.schema";

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (error) => {
  console.error("Redis error:", error);
});

export async function pushTheFloorDraftInTheQueue(jobName: string, data: GetDraftType) {
  try {
    if (!client.isOpen) {
      await client.connect();
    }

    // --------------------------------------------------
    // 1. Check the floor
    // --------------------------------------------------

    const floor = await prisma.floor.findUnique({
      where: {
        id: data.floorId,
      },
      select: {
        asyncJobId: true,
        asyncJobType: true,
        asyncJobStatus: true,
      },
    });

    if (!floor) {
      throw new Error("Floor not found");
    }

    // --------------------------------------------------
    // 2. Prevent duplicate jobs
    // --------------------------------------------------

    if (
      floor.asyncJobId !== null &&
      floor.asyncJobType === jobName &&
      (floor.asyncJobStatus === "PENDING" || floor.asyncJobStatus === "PROCESSING")
    ) {
      console.log(`Active job already exists for floor ${data.floorId}: ${floor.asyncJobId}`);

      return floor.asyncJobId;
    }

    // --------------------------------------------------
    // 3. Create a new job ID
    // --------------------------------------------------

    const jobId = await client.incr("counters:floor_job_id");

    // --------------------------------------------------
    // 4. Create Redis payload
    // --------------------------------------------------

    const payload = JSON.stringify({
      jobId,
      ...data,
    });

    // --------------------------------------------------
    // 5. Push job into Redis
    // --------------------------------------------------

    await client.lPush(jobName, payload);

    // --------------------------------------------------
    // 6. Save job information in database
    // --------------------------------------------------

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

    console.log(`New floor draft job queued: ${jobId} for floor ${data.floorId}`);

    return jobId;
  } catch (error) {
    console.error("Failed to push floor draft to queue:", error);

    throw error;
  }
}
