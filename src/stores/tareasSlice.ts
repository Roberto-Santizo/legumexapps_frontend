import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";

//TYPES
import { TareasPaginateSchema, TareaSchema, TareasSchema} from "../utils/tareas-schema";
import { DraftTarea, Tarea, TareasPaginate } from "../types";

export type TareasSliceType = {

    errorsTareas: string[];
    
    getAllTareasPaginate: (page : number) => Promise<TareasPaginate>
    getAllTareas: () => Promise<Tarea[]>;
    createTarea: (Tarea: DraftTarea) => Promise<void>
    getTareaById: (id: Tarea['id']) => Promise<Tarea>
    updateTarea: (id: Tarea['id'], Tarea: DraftTarea) => Promise<void>
    uploadTareas: (file: File[]) => Promise<void>
}

export const createTareasSlice: StateCreator<TareasSliceType> = (set) => ({
    errorsTareas: [],

    getAllTareasPaginate: async (page) => {
        const url = `/api/tareas?page=${page}`;
        try {
            const { data } = await clienteAxios(url);
            const result = TareasPaginateSchema.safeParse(data);

            if (result.success) {
                return result.data;
            }else{
                throw new Error('Hubo un error al trear las tareas');
            }
        } catch (error : any) {
            throw error;
        }
    },
    getAllTareas: async () => {
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
            throw error;
        }
    },
    createTarea: async (tarea) => {
        const url = '/api/tareas';
        try {
            await clienteAxios.post(url, tarea)
            set({errorsTareas: []});
        } catch (error: any) {
            set({ errorsTareas: Object.values(error.response.data.errors)});
            throw error;
        }
    },


    getTareaById: async (id) => {
        const url = `/api/tareas/${id}`
        try {
            const { data } = await clienteAxios(url, {
            });
            const result = TareaSchema.safeParse(data.data);
            if(result.success){
                return result.data
            }else{
                throw new Error('Datos no válidos');
            }
        } catch (error : any) {
            throw error;
        }
    },
    updateTarea: async (id, tarea) => {
        const url = `/api/tareas/${id}`
        try {
            await clienteAxios.put(url, tarea);
            set({errorsTareas: []});
        } catch (error : any) {
            set({ errorsTareas: Object.values(error.response.data.errors)});
            throw error;
        }
    },
    uploadTareas: async (file) => {
        try {
            const url = '/api/tareas/upload';
            const formData = new FormData();
            formData.append("file", file[0]);
            await clienteAxios.post(url, formData);
            set({ errorsTareas: []})
        } catch (error: any) {
            console.log(error);
            set({ errorsTareas: error.response.data.message})
            throw error;
        }
        
    }

})