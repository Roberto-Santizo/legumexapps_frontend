import { z } from "zod";
import { paginatedSchema } from "./schemas";

export const InsumoSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    measure: z.string(),
});

export const InsumosSchema = z.object({
    data: z.array(InsumoSchema),
    meta: paginatedSchema.optional()
});