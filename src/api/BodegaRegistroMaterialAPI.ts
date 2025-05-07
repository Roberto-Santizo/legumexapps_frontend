import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import {DraftMaterialRegister} from "@/views/bodega/formularios/CrearRegistroMaterial";
import { MaterialRegisterPaginateSchema } from "@/utils/bodega-registroMaterial-schema";
import {MaterialRegisterPaginate} from "@/types";

export async function RegistroMaterial(FormData: DraftMaterialRegister) {
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

export async function getPaginatedRegistroMaterial(page: number): Promise<MaterialRegisterPaginate> {
    try {
        const url = `/api/tareas?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = MaterialRegisterPaginateSchema.safeParse(data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Hubo un error al traer los registros de materiales');
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}