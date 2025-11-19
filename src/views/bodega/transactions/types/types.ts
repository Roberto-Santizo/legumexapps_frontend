import { PackingMaterialTransactionSchema, PackingMaterialTransactionsSchema } from "@/utils/packingMaterialTransactionSchema";
import { z } from "zod";

export type FiltersPackingMaterialsTransactionType = {
  transaction_id: string;
  responsable: string;
  delivered_by: string;
  delivered_date: string;
  type: string;
  sku: string;
}

export type DraftPackingMaterialTransactionItem = {
    packing_material_id: string;
    name: string;
    quantity: number;
    lote: string;
    destination: string | null;
    code: string;
}

export type DraftTaskProductionWastage = {
    packing_material_id: string;
    quantity: number;
    lote: string;
}


export type PackingMaterialTransaction = z.infer<typeof PackingMaterialTransactionSchema>;
export type PackingMaterialTransactions = z.infer<typeof PackingMaterialTransactionsSchema>;


export type DraftTransactionPackingMaterial = {
    task_production_plan_id: string;
    reference: string;
    responsable: string;
    responsable_signature: string;
    user_signature: string;
    observations: string;
    items: DraftPackingMaterialTransactionItem[];
    wastages: DraftTaskProductionWastage[];
    type: string;
}