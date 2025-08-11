import { z } from "zod";

export const PackingMaterialTransactionSchema = z.object({
    id: z.string(),
    transaction_date: z.string(),
    reference: z.string(),
    responsable: z.string(),
    user: z.string(),
    type: z.string()
});


export const PackingMaterialTransactionsSchema = z.object({
    data: z.array(PackingMaterialTransactionSchema),
    meta: z.object({
        current_page: z.number(),
        last_page: z.number()
    }).optional()
});