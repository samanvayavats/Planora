import { z } from "zod";

// 1. Define internal structures for JSON fields based on your payload
const materialBreakdownSchema = z.object({
  flooring: z.number().nonnegative(),
  painting: z.number().nonnegative(),
  plumbing: z.number().nonnegative(),
  electrical: z.number().nonnegative(),
  other: z.number().nonnegative(),
});

const timelinePhaseSchema = z.object({
  name: z.string().min(1),
  duration: z.number().int().positive(),
});

const timelineSchema = z.object({
  duration: z.number().int().positive(),
  phases: z.array(timelinePhaseSchema),
});

// 2. Define the main CostEstimate Validation Schema
export const CostEstimateSchema = z.object({
  versionId: z.string(),

  // Costs
  materialCost: z.number().nonnegative("Material cost cannot be negative"),
  laborCost: z.number().nonnegative("Labor cost cannot be negative"),
  contingency: z.number().nonnegative().default(0),
  totalCost: z.number().nonnegative("Total cost cannot be negative"),
  costPerSqft: z.number().nonnegative("Cost per sqft cannot be negative"),

  // Breakdown by category (JSON strings validated into specific objects)
  materialBreakdown: materialBreakdownSchema.nullable().optional(),

  // Timeline (JSON strings validated into structural timeline object)
  timeline: timelineSchema.nullable().optional(),

  // Assumptions
  assumptions: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  quality: z.enum(["basic", "standard", "premium"]).default("standard"),
});

// 3. Extract the TypeScript Type
export type CostEstimateType = z.infer<typeof CostEstimateSchema>;
