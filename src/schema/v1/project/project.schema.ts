import { z } from "zod";

export const ProjectSchema = z.object({
  userId: z.string(),
  title: z.string(),
  description: z.enum(["residential", "commercial", "mixed"]),
  totalFloors: z.number(),
  activeFloorNumber: z.number(),
  status: z.enum(["draft", "approved", "archived"]),
  isPublic: z.boolean().optional(),
});

export type ProjectType = z.infer<typeof ProjectSchema>;

export const PlotConfigurationSchema = z.object({
  projectId: z.string().optional(),
  shapeType: z.string(),
  width: z.number(),
  height: z.number(),
  secondWidth: z.number().optional(),
  secondHeight: z.number().optional(),
  totalArea: z.number(),
  customPoints: z.json().optional(),
  northFacing: z.boolean(),
  cornerPlot: z.boolean(),
  slopedPlot: z.boolean(),
  obstacles: z.string().optional(),
  plotImageUrl: z.string().optional(),
});

export type PlotConfigurationType = z.infer<typeof PlotConfigurationSchema>;

export const PlotConfigurationSchemaPlotConfigurationSchemaCombined = z.intersection(
  ProjectSchema,
  PlotConfigurationSchema,
);

export type PlotConfigurationTypePlotConfigurationTypeCombined = z.infer<
  typeof PlotConfigurationSchemaPlotConfigurationSchemaCombined
>;
