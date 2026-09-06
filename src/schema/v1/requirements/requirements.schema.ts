import { z } from "zod";

export const RequirementsSchema = z.object({
  // Relations (one-to-one optional connections)
  floorId: z.string().nullable().optional(),
  versionId: z.string().nullable().optional(),

  // Basic requirements
  bedrooms: z.number().int().nonnegative().default(0),
  bathrooms: z.number().nonnegative().default(0),
  kitchen: z.boolean().default(true),
  livingRoom: z.boolean().default(true),

  // Dimensions & Budget
  plotWidth: z.number().positive(),
  plotHeight: z.number().positive(),
  totalArea: z.number().positive(),
  budget: z.number().positive().nullable().optional(),

  // Room collections & counts
  roomTypes: z.array(z.string()),
  roomCount: z.number().int().nonnegative(),

  // Special requirements & constraints
  specialRooms: z.array(z.string()).default([]),
  constraints: z.array(z.string()).default([]),
  accessibility: z.boolean().default(false),
  preferredLayout: z.enum(["open", "compartmentalized"]).nullable().optional(),

  // Additional notes & metadata
  notes: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type RequirementsType = z.infer<typeof RequirementsSchema>;
