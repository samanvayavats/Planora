import { z } from "zod";

export const FloorSchema = z.object({
  projectId: z.string(),
  floorNumber: z.number().default(0),
  floorName: z.string().default("second floor"),
  floorType: z.string().default("middle"),
  currentVersionId: z.string(),
});

export type FloorType = z.infer<typeof FloorSchema>;
