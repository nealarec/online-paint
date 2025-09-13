import { z } from "zod";

export const paintSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

export const pointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const pathSchema = z.object({
  points: z.array(pointSchema).min(2),
  color: z.string(),
  weight: z.number(),
  tool: z.enum(["brush", "pencil", "eraser"]),
});

export const drawingSchema = z.object({
  name: z.string(),
  paths: z.array(pathSchema),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const roomUserSchema = userSchema.extend({
  position: pointSchema.optional(),
});

export const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  users: z.record(z.string(), roomUserSchema),
  paths: z.array(pathSchema),
  createdAt: z.union([z.date(), z.string().datetime()]).optional(),
  updatedAt: z.union([z.date(), z.string().datetime()]).optional(),
});
