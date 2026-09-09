import { z } from "zod";

export const generateAiReportSchema = z.object({
  from: z.string(),
  to: z.string(),
});
