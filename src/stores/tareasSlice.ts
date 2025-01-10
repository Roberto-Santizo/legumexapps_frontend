import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";

//TYPES
import { Tarea as TareaSchema, Tareas } from "../utils/tareas-schema";
import { DraftTarea, Tarea } from "../types";

export type TareasSliceType = {
    loadingTareas: boolean
    loadingUpdateTarea:boolean
    errorFetchTareas: boolean
    errorCreateTarea: boolean
    errorUpdateTarea: boolean
    errorGetTarea: boolean
    errorsTareas: string[]
    tareas: Tarea[]
    editingTarea: Tarea
    fetchTareas: () => Promise<void>
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
        const url = 'http://127.0.0.1:8000/api/tareas';
        try {
            const { data } = await clienteAxios(url, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            });
            const result = Tareas.safeParse(data);
            if (result.success) {
                set({ tareas: data.data, loadingTareas: false })
            }
        } catch (error) {
            set({ errorFetchTareas: true, loadingTareas: false })
        }
    },

    createTarea: async (tarea) => {
        set({ loadingTareas: true })
        const url = 'http://127.0.0.1:8000/api/tareas';

        try {
            await clienteAxios.post(url, tarea, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            })

        } catch (error: any) {
            set({ errorsTareas: Object.values(error.response.data.errors), errorCreateTarea: true, loadingTareas: false });
            throw error;
        }
    },
    getTarea: async (id) => {
        set({ loadingTareas: true });
        const url = `http://127.0.0.1:8000/api/tareas/${id}`
        try {
            const { data } = await clienteAxios(url, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            });
            const result = TareaSchema.safeParse(data.data);
            set({ loadingTareas: false, editingTarea: result.data });
        } catch (error) {
            set({ loadingTareas: false, errorGetTarea: true })
        }
    },
    updateTarea: async (id, tarea) => {
        set({ loadingUpdateTarea: true });
        const url = `http://127.0.0.1:8000/api/tareas/${id}`

        try {
            await clienteAxios.put(url, tarea, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            });
            set({ loadingUpdateTarea: false, editingTarea: {} as Tarea, errorsTareas: []});
        } catch (error : any) {
            set({ errorsTareas: Object.values(error.response.data.errors), errorUpdateTarea: true, loadingUpdateTarea: false });
            throw error;
        }
    }

})