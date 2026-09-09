import { z } from "zod";

// 1. Define the internal structures for your JSON fields
const doorSchema = z.object({
  id: z.string(),
  position: z.string(),
  x: z.number(),
  y: z.number(),
});

const windowSchema = z.object({
  id: z.string(),
  position: z.string(),
  count: z.number().int().positive(),
});

export const roomSchema = z.object({
  floorId: z.string(),
  // Room identification
  roomId: z.string(),
  type: z.string(),

  // Dimensions
  area: z.number().positive("Area must be greater than 0"),
  width: z.number().positive("Width must be greater than 0"),
  height: z.number().positive("Height must be greater than 0"),

  // Position on floor
  x: z.number(),
  y: z.number(),

  // Display (Validates hex color codes, e.g., #E8F4F8 or #FFF)
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color code")
    .default("#E8F4F8"),

  // Doors and windows (Validates JSON structures as arrays)
  doors: z.array(doorSchema).nullable().optional(),
  windows: z.array(windowSchema).nullable().optional(),

  // Relationships
  adjacent: z.array(z.string()),
  priority: z.number().int(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// 3. Extract the TypeScript Type from the schema
export type RoomType = z.infer<typeof roomSchema>;
