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
