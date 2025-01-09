import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { Tarea as TareaSchema, Tareas } from "../utils/tareas-schema";
import { DraftTarea, Tarea } from "../types";

export type TareasSliceType = {
    loadingTareas: boolean
    errorTareas: boolean
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
    errorTareas: false,
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
            set({ errorTareas: true, loadingTareas: false })
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
            set({ errorsTareas: Object.values(error.response.data.errors), errorTareas: true, loadingTareas: false });
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
            set({ loadingTareas: false, errorTareas: true })
        }
    },
    updateTarea: async (id, tarea) => {
        set({ loadingTareas: true });
        const url = `http://127.0.0.1:8000/api/tareas/${id}`

        try {
            await clienteAxios.put(url, tarea, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            });
            set({ loadingTareas: false, editingTarea: {} as Tarea});
        } catch (error : any) {
            set({ errorsTareas: Object.values(error.response.data.errors), errorTareas: true, loadingTareas: false });
            throw error;
        }
    }

})