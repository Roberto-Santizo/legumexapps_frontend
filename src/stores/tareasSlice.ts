import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";

//TYPES
import { Tarea as TareaSchema, Tareas } from "../utils/tareas-schema";
import { DraftTarea, Tarea } from "../types";

export type TareasSliceType = {

    errorsTareas: string[];
    
    getAllTareas: () => Promise<Tarea[]>
    createTarea: (Tarea: DraftTarea) => Promise<void>
    getTareaById: (id: Tarea['id']) => Promise<Tarea>
    updateTarea: (id: Tarea['id'], Tarea: DraftTarea) => Promise<void>
}

export const createTareasSlice: StateCreator<TareasSliceType> = (set) => ({
    errorsTareas: [],

    getAllTareas: async () => {
        const url = '/api/tareas';
        try {
            const { data } = await clienteAxios(url);
            const result = Tareas.safeParse(data);
            if (result.success) {
                return result.data.data;
            }else{
                return [];
            }
        } catch (error : any) {
            return [];
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
    }

})