import { z } from "zod";
import { paginatedSchema } from "./schemas";
import { DataLoteSchema, DataSchema } from "@/api/LotesAPI";

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

export const LoteCDPDetailsSchema = z.object({
    data_lote: DataLoteSchema,
    data: DataSchema,
});