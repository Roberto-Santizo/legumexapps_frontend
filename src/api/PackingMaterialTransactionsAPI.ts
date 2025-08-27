import { DraftTransactionPackingMaterial } from "@/components/modals/ModalEntregaMaterialEmpaque";
import { isAxiosError } from "axios";
import { TransactionTaskProductionSchema } from "@/utils/taskProductionPlanSchemas";
import { FiltersPackingMaterialsTransactionType } from "@/views/bodega/transactions/Index";
import clienteAxios from "@/config/axios";
import { PackingMaterialTransactionsSchema } from "@/utils/packingMaterialTransactionSchema";
import { PackingMaterialTransaction } from "types/packingMaterialTransactionTypes";

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


export async function getPackingMaterialTransactions({ page, paginated, filters }: { page: number, paginated: string, filters: FiltersPackingMaterialsTransactionType }) {
    try {
        const url = `/api/packing-material-transaction?paginated=${paginated}&page=${page}&transaction=${filters.transaction_id}&responsable=${filters.responsable}&delivered_by=${filters.delivered_by}&delivered_date=${filters.delivered_date}&type=${filters.type}&sku=${filters.sku}`;
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

        if (result) {
            return result.data
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);

        }
    }
}