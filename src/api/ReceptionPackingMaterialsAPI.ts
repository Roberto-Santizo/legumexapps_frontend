import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { z } from "zod";
import { FiltersReceptionsPackingMaterial } from "@/views/bodega/recepcion-material-empaque/IndexRecepcionMaterial";
import {DraftMaterialReception} from "@/views/bodega/recepcion-material-empaque/CrearRecepcionMaterial"
import { DraftItem } from "@/views/bodega/recepcion-material-empaque/CrearRecepcionMaterial";

// export async function createReceptionMaterial(FormData: DraftMaterialReception) {
//     try {
//         const url = '/pendiente de agregar la api aca';
//         const { data } = await clienteAxios.post<string>(url, FormData)
//         return data;
//     } catch (error) {
//         if (isAxiosError(error)) {
//             throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
//         }
//     }
// }
export type ReceptionPayload = DraftMaterialReception & {
  items: DraftItem[];
};

export async function registerReception(payload: ReceptionPayload) {
  try {
    const url = "/api/packicking-material-reception";
    const { data } = await clienteAxios.post<string>(url, payload);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        Object.values(error.response?.data?.errors || {}).flat().join("\n")
      );
    }
  }
}

export const ItemPackingMaterialSchema = z.object({
    id: z.string(),
    code: z.string(),
    description: z.string(),
    supplier: z.string(),
    lote: z.string(),
    quantity: z.number()
});

export const ReceptionPackigMaterialSchema = z.object({
    id: z.string(),
    receipt_date: z.string(),
    invoice_date: z.string(),
    observations: z.string(),
    received_by: z.string(),
    received_by_signature: z.string(),
    supervisor_name: z.string(),
    supervisor_signature: z.string(),
    items: z.array(ItemPackingMaterialSchema)
});

export const ReceptionPackigMaterialPaginatedSchema = z.object({
    data: z.array(ReceptionPackigMaterialSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export type ReceptionPackigMaterial = z.infer<typeof ReceptionPackigMaterialSchema>;
export type ReceptionPackigMaterialPaginated = z.infer<typeof ReceptionPackigMaterialPaginatedSchema>;

export async function getPaginatedReceptionsPackingMaterial(page: number, filters: FiltersReceptionsPackingMaterial): Promise<ReceptionPackigMaterialPaginated> {
    try {
        const url = `/api/packing-material-reception?page=${page}&supervisor_name=${filters.supervisor_name}&received_by=${filters.received_by}&contains=${filters.contains}&receipt_date=${filters.receipt_date}&invoice_date=${filters.invoice_date}`;
        const { data } = await clienteAxios(url);
        const result = ReceptionPackigMaterialPaginatedSchema.safeParse(data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Hubo un error al traer el material');
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getReceptionPackingMaterialById(id: ReceptionPackigMaterial['id']): Promise<ReceptionPackigMaterial> {
    try {
        const url = `/api/packing-material-reception/${id}`;
        const { data } = await clienteAxios(url);
        const result = ReceptionPackigMaterialSchema.safeParse(data.data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Información no válida');
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}