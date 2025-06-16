import { z } from "zod";
import { paginatedSchema } from "./schemas";

export const LoteSchema = z.object({
    id: z.string(),
    name: z.string(),
    finca: z.string(),
    cdp: z.string()
});

export const LotesSchema = z.object({
    data: z.array(LoteSchema),
    meta: paginatedSchema.optional()
});
