import { z } from "zod";

export const paintSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});
