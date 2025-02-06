import { z } from "zod";

export const ReportSchema = z.object({
    fileName: z.string(),
    file: z.string(),
});
