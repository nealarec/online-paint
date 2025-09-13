import { z } from "zod";
import {
  drawingSchema,
  pathSchema,
  pointSchema,
  roomSchema,
  userSchema,
} from "../schemas";

// Schema-based types
export type Drawing = z.infer<typeof drawingSchema>;
export type Path = z.infer<typeof pathSchema>;
export type Point = z.infer<typeof pointSchema>;
export type Room = z.infer<typeof roomSchema>;
export type User = z.infer<typeof userSchema>;

// Socket-related types
export * from "./socket";

export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX | string;
