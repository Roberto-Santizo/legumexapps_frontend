import clienteAxios from "@/config/axios";
import { Tarea, TareasPaginate } from "@/types";
import { TareaSchema, TareasPaginateSchema } from "@/utils/tareas-schema";
import { DraftTarea } from "@/views/agricola/tareas/CreateTarea";
import { FiltersTareasType } from "@/views/agricola/tareas/IndexTareas";
import { isAxiosError } from "axios";

export async function createTarea(FormData: DraftTarea) {
    try {
        const url = '/api/tareas';
        const { data } = await clienteAxios.post<string>(url, FormData)
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function uploadTareas(file: File[]) {
    try {
        const url = '/api/tareas/upload';
        const formData = new FormData();
        formData.append("file", file[0]);
        const { data } = await clienteAxios.post<string>(url, formData);
        return data;
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function getTasks({ page, filters, paginated }: { page: number, filters: FiltersTareasType, paginated: boolean }): Promise<TareasPaginate> {
    try {
        const url = `/api/tareas?paginated=${paginated}&page=${page}&name=${filters.name}&code=${filters.code}`;
        const { data } = await clienteAxios(url);
        const result = TareasPaginateSchema.safeParse(data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Hubo un error al trear las tareas');
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}


export async function getTareaById(id: Tarea['id']): Promise<Tarea> {
    try {
        const url = `/api/tareas/${id}`
        const { data } = await clienteAxios(url, {
        });
        const result = TareaSchema.safeParse(data.data);
        if (result.success) {
            return result.data
        } else {
            throw new Error('Datos no válidos');
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export async function updateTarea({ id, FormData }: { id: Tarea['id'], FormData: DraftTarea }) {
    try {
        const url = `/api/tareas/${id}`
        const { data } = await clienteAxios.put<string>(url, FormData);
        return data;
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}