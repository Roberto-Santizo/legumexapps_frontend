import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";

//TYPES
import { Tarea as TareaSchema, Tareas } from "../utils/tareas-schema";
import { DraftTarea, Tarea } from "../types";

export type TareasSliceType = {
    
    //TREAR TAREAS
    fetchTareas: () => Promise<Tarea[]>
    loadingTareas: boolean
    errorFetchTareas: boolean
    tareas: Tarea[]


    loadingUpdateTarea:boolean
    errorCreateTarea: boolean
    errorUpdateTarea: boolean
    errorGetTarea: boolean
    errorsTareas: string[]
    editingTarea: Tarea
    
    createTarea: (Tarea: DraftTarea) => Promise<void>
    getTarea: (id: Tarea['id']) => Promise<void>
    updateTarea: (id: Tarea['id'], Tarea: DraftTarea) => Promise<void>
}


export const createTareasSlice: StateCreator<TareasSliceType> = (set) => ({
    loadingTareas: false,
    loadingUpdateTarea: false,
    errorFetchTareas: false,
    errorCreateTarea: false,
    errorUpdateTarea: false,
    errorGetTarea: false,
    errorsTareas: [],
    editingTarea: {} as Tarea,
    tareas: [],
    fetchTareas: async () => {
        set({ loadingTareas: true });
        const url = '/api/tareas';
        try {
            const { data } = await clienteAxios(url);
            const result = Tareas.safeParse(data);
            if (result.success) {
                set({loadingTareas: false })
                return result.data.data;
            }else{
                return [];
            }
        } catch (error) {
            set({ errorFetchTareas: true, loadingTareas: false });
            return [];
        }
    },

    createTarea: async (tarea) => {
        set({ loadingTareas: true })
        const url = '/api/tareas';

        try {
            await clienteAxios.post(url, tarea)

        } catch (error: any) {
            set({ errorsTareas: Object.values(error.response.data.errors), errorCreateTarea: true, loadingTareas: false });
            throw error;
        }
    },
    getTarea: async (id) => {
        set({ loadingTareas: true });
        const url = `/api/tareas/${id}`
        try {
            const { data } = await clienteAxios(url, {
            });
            const result = TareaSchema.safeParse(data.data);
            set({ loadingTareas: false, editingTarea: result.data });
        } catch (error) {
            set({ loadingTareas: false, errorGetTarea: true })
        }
    },
    updateTarea: async (id, tarea) => {
        set({ loadingUpdateTarea: true });
        const url = `/api/tareas/${id}`

        try {
            await clienteAxios.put(url, tarea);
            set({ loadingUpdateTarea: false, editingTarea: {} as Tarea, errorsTareas: []});
        } catch (error : any) {
            set({ errorsTareas: Object.values(error.response.data.errors), errorUpdateTarea: true, loadingUpdateTarea: false });
            throw error;
        }
    }

})