import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import {MaterialReceptionPaginate } from "@/types";
import{DraftMaterialReception} from "@/views/bodega/formularios/CrearRecepcionMaterial";
import { MaterialReceptionPaginateSchema } from "@/utils/bodega-recepcionMaterial-schema";

export async function createReceptionMaterial(FormData: DraftMaterialReception) {
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

export async function getPaginatedMaterial(page: number): Promise<MaterialReceptionPaginate> {
    try {
        const url = `/api/tareas?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = MaterialReceptionPaginateSchema.safeParse(data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Hubo un error al traer el material');
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}