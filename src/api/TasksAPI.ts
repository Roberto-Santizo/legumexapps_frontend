import clienteAxios from "@/config/axios";
import { FiltersTareasType } from "@/views/agricola/tasks/Index";
import { isAxiosError } from "axios";
import { TaskSchema, TasksSchema } from "@/utils/taskGeneralSchemas";
import { DraftTask, TaskGeneral } from "@/types/taskGeneralType";

export async function createTarea(FormData: DraftTask) {
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


export async function getTasks({ page, filters, paginated }: { page: number, filters: FiltersTareasType, paginated: string }) {
    try {
        const url = `/api/tareas?paginated=${paginated}&page=${page}&name=${filters.name}&code=${filters.code}`;
        const { data } = await clienteAxios(url);
        const result = TasksSchema.safeParse(data);

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


export async function getTareaById(id: TaskGeneral['id']) {
    try {
        const url = `/api/tareas/${id}`
        const { data } = await clienteAxios(url, {
        });
        const result = TaskSchema.safeParse(data.data);
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

export async function updateTarea({ id, FormData }: { id: TaskGeneral['id'], FormData: DraftTask }) {
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