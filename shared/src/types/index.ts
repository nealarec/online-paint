import {
  drawingSchema,
  pathSchema,
  pointSchema,
  roomSchema,
  userSchema,
} from "../schemas";
import { z } from "zod";

export type Drawing = z.infer<typeof drawingSchema>;
export type Path = z.infer<typeof pathSchema>;
export type Point = z.infer<typeof pointSchema>;
export type Room = z.infer<typeof roomSchema>;
export type User = z.infer<typeof userSchema>;
