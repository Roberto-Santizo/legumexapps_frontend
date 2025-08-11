import { PackingMaterialTransactionSchema, PackingMaterialTransactionsSchema } from "@/utils/packingMaterialTransactionSchema";
import { z } from "zod";

export type PackingMaterialTransaction = z.infer<typeof PackingMaterialTransactionSchema>;
export type PackingMaterialTransactions = z.infer<typeof PackingMaterialTransactionsSchema>;
