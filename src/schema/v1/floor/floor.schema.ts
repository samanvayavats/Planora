import { cuid2, z } from "zod";

export const FloorSchema = z.object({
  projectId: z.string(),
  floorNumber: z.number().default(0),
  floorName: z.string().default("second floor"),
  floorType: z.string().default("middle"),
  currentVersionId: z.string(),
});

export type FloorType = z.infer<typeof FloorSchema>;

export const FloorVersionSchema = z.object({
  versionId: z.cuid2(),
  versionNumber: z.number().default(0),
  changeLog: z.string().default("no changes ,first version"),
  changeType: z.string().default("initial"),
});

export type FloorVersionType = z.infer<typeof FloorVersionSchema>;
