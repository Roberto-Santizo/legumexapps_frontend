import clienteAxios from "@/config/axios";
import { InputsPaginate } from "@/types";

import {WarehouseSupplyPaginateSchema} from "@/utils/bodegaInsumos-schema";
import {DraftInputs} from "@/views/bodega/formularios/CrearInsumo";
import { isAxiosError } from "axios";

export async function createReceptionInsumos(FormData: DraftInputs) {
    try {
        const url = '/api/tareas';//Agregar aca la url correcta de proveedores 
        const { data } = await clienteAxios.post<string>(url, FormData)
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function getPaginatedInsumos(page: number): Promise<InputsPaginate> {
    try {
        const url = `/api/tareas?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = WarehouseSupplyPaginateSchema.safeParse(data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Hubo un error al trear los insumos');
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}