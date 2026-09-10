import { z } from "zod";
import { FloorPlanSchema } from "../floor/floor.schema";
import { RoomSchema } from "../room/room.schema";
import { CostEstimateSchema } from "../cost-estimation/cost-estimation.schema";

// Raw data returned by generateFloorPlanData()
export const AiPayloadDataSchema = z.object({
  floorPlan: FloorPlanSchema,
  rooms: z.array(RoomSchema),
  costEstimate: CostEstimateSchema,
});

export type AiPayloadDataType = z.infer<typeof AiPayloadDataSchema>;

// Wrapper if your API returns a JSON response to the client
export const AiResponseSchema = z.object({
  message: z.string(),
  data: AiPayloadDataSchema,
});

export type AiResponseType = z.infer<typeof AiResponseSchema>;
