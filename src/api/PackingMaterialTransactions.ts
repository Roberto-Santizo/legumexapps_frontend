import { DraftTransactionPackingMaterial } from "@/components/modals/ModalEntregaMaterialEmpaque";
import { isAxiosError } from "axios";
import { z } from "zod";
import clienteAxios from "@/config/axios";
import { TransactionTaskProductionSchema } from "@/utils/taskProductionPlanSchemas";
import { FiltersPackingMaterialsTransactionType } from "@/views/bodega/transacciones-matrial-empaque/IndexPackingMaterialTransaction";

export async function createPackingMaterialTransaction(FormData: DraftTransactionPackingMaterial) {
    try {
        const url = '/api/packing-material-transaction';
        const { data } = await clienteAxios.post(url, FormData);
        return data;
    } catch (error) {
        if ((isAxiosError(error))) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else if (error.response?.data.msg) {
                throw new Error(error.response.data.msg);

            }
        }
    }
}

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

export type PackingMaterialTransaction = z.infer<typeof PackingMaterialTransactionSchema>;
export type PackingMaterialTransactions = z.infer<typeof PackingMaterialTransactionsSchema>;

export async function getPackingMaterialTransactions({ page, paginated, filters}: { page: number, paginated: string, filters: FiltersPackingMaterialsTransactionType }): Promise<PackingMaterialTransactions> {
    try {
        const url = `/api/packing-material-transaction?paginated=${paginated}&page=${page}&transaction=${filters.transaction_id}&responsable=${filters.responsable}&delivered_by=${filters.delivered_by}&delivered_date=${filters.delivered_date}&type=${filters.type}`;
        const { data } = await clienteAxios(url);
        const result = PackingMaterialTransactionsSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        throw error;
    }
}
export async function getPackingMaterialTransactionById({ id }: { id: PackingMaterialTransaction['id'] }) {
    try {
        const url = `/api/packing-material-transaction/${id}`;

        const { data } = await clienteAxios(url);

        const result = TransactionTaskProductionSchema.safeParse(data);

        if(result){
            return result.data
        }
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.msg);
            
        }
    }
}