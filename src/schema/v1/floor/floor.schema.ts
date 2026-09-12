import { cuid2, z } from "zod";
import { RequirementsSchema } from "../requirements/requirements.schema";

export const FloorSchema = z.object({
  projectId: z.string(),
  floorNumber: z.number().default(0),
  floorName: z.string().default("second floor"),
  floorType: z.string().default("middle"),
  currentVersionId: z.string(),
  asyncJobType: z.string(),
  asyncJobStatus: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"]).default("PENDING"),
});

export type FloorType = z.infer<typeof FloorSchema>;

export const FloorVersionSchema = z.object({
  versionId: z.cuid2(),
  versionNumber: z.number().default(0),
  changeLog: z.string().default("no changes ,first version"),
  changeType: z.string().default("initial"),
});

export type FloorVersionType = z.infer<typeof FloorVersionSchema>;

export const FloorAndRequirementsSchema = z.intersection(FloorSchema, RequirementsSchema);
export const FloorAndRequirementsFloorVersionSchema = z.intersection(
  FloorAndRequirementsSchema,
  FloorVersionSchema,
);

export type FloorAndRequirementsType = z.infer<typeof FloorAndRequirementsSchema>;
export type FloorAndRequirementsFloorVersionType = z.infer<
  typeof FloorAndRequirementsFloorVersionSchema
>;

export const GetDraftSchema = z.object({
  projectId: z.string(),
  floorId: z.string(),
  versionId: z.string(),
});

export type GetDraftType = z.infer<typeof GetDraftSchema>;

export const FloorPlanSchema = z.object({
  versionId: z.string(),
  plotWidth: z.number(),
  plotHeight: z.number(),
  totalArea: z.number(),
  utilization: z.number(),
  svgCode: z.string(),
});

export type FloorPlanType = z.infer<typeof FloorPlanSchema>;
