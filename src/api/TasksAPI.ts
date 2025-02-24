import clienteAxios from "@/config/axios";
import { DraftTarea, Tarea, TareasPaginate } from "@/types";
import { TareaSchema, TareasPaginateSchema, TareasSchema } from "@/utils/tareas-schema";

export async function createTarea(data : DraftTarea) : Promise<void | string[]> {
    try {
        const url = '/api/tareas';
        await clienteAxios.post(url, data)
    } catch (error: any) {
        return Object.values(error.response.data.errors);
    }
}

export async function uploadTareas(file : File[]) : Promise<void | string>{
    try {
        const url = '/api/tareas/upload';
        const formData = new FormData();
        formData.append("file", file[0]);
        await clienteAxios.post(url, formData);
    } catch (error: any) {
        return error.response.data.message;
    }
}

export async function getPaginatedTasks(page:number) : Promise<TareasPaginate> {
    try {
        const url = `/api/tareas?page=${page}`;
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

export async function getAllTasks() : Promise<Tarea[]> {
    try {
        const url = '/api/tareas-all';
        const { data } = await clienteAxios(url);
        const result = TareasSchema.safeParse(data);
        if(result.success){
            return result.data.data
        }else{
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTareaById(id : Tarea['id']) : Promise<Tarea>{
    try {
        const url = `/api/tareas/${id}`
        const { data } = await clienteAxios(url, {
        });
        const result = TareaSchema.safeParse(data.data);
        if(result.success){
            return result.data
        }else{
            throw new Error('Datos no válidos');
        }
    } catch (error : any) {
        console.log(error);
        throw error;
    }
}

export async function updateTarea(id: Tarea['id'], data: DraftTarea)  : Promise<void | string[]>{
    try {
        const url = `/api/tareas/${id}`
        await clienteAxios.put(url, data);
    } catch (error : any) {
        return Object.values(error.response.data.errors);
    }
}