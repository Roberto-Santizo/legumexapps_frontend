import { DraftTransactionPackingMaterial } from "@/components/modals/ModalEntregaMaterialEmpaque";
import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { z } from "zod";

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

export async function getPackingMaterialTransactions({ page, paginated }: { page: number, paginated: string }): Promise<PackingMaterialTransactions> {
    try {
        const url = `/api/packing-material-transaction?paginated=${paginated}&page=${page}`;
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