import { DraftDispatchPackingMaterial } from "@/components/modals/ModalEntregaMaterialEmpaque";
import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { z } from "zod";

export async function createPackingMaterialDispatch(FormData: DraftDispatchPackingMaterial) {
    try {
        const url = '/api/packing-material-dispatch';
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

export const PackingMaterialDispatchSchema = z.object({
    id: z.string(),
    dispatch_date: z.string(),
    reference: z.string(),
    responsable: z.string(),
    user: z.string()
});

export const PackingMaterialDispatchesSchema = z.object({
    data: z.array(PackingMaterialDispatchSchema),
    meta: z.object({
        current_page: z.number(),
        last_page: z.number()
    }).optional()
});

export type PackingMaterialDispatch = z.infer<typeof PackingMaterialDispatchSchema>;
export type PackingMaterialDispatches = z.infer<typeof PackingMaterialDispatchesSchema>;

export async function getPackingMaterialDispatches({ page, paginated }: { page: number, paginated: string }): Promise<PackingMaterialDispatches> {
    try {
        const url = `/api/packing-material-dispatch?paginated=${paginated}&page=${page}`;
        const { data } = await clienteAxios(url);
        const result = PackingMaterialDispatchesSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        throw error;
    }
}