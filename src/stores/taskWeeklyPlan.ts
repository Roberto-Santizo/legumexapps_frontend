import { StateCreator } from "zustand"
import clienteAxios from "../config/axios"
import { TasksWeeklyPlan, TaskWeeklyPlan } from "../types"
import { TasksWeeklyPlanSchema } from "../utils/taskWeeklyPlan-schema";

export type TaskWeeklyPlanSliceType = {
    tasks: TasksWeeklyPlan;

    loadingFetchTasks: boolean;
    loadingCreatePartialClosure: boolean;
    loadingUpdateTask: boolean;

    errorLoadingFetchTasks: boolean;
    errorCreatePartialClosure: boolean;

    fetchTasks: (id : TaskWeeklyPlan['id']) => Promise<void>
    reloadTasks: (id : TaskWeeklyPlan['id']) => Promise<void>
    createPartialClosure: (id: TaskWeeklyPlan['id']) => Promise<void>
}


export const createTaskWeeklyPlanSlice: StateCreator<TaskWeeklyPlanSliceType> = (set) => ({
    tasks: { week: 0, finca: '',lote: '', data: [] },
    loadingFetchTasks: false,
    loadingCreatePartialClosure:false,
    loadingUpdateTask:false,
    errorLoadingFetchTasks: false,
    errorCreatePartialClosure: false,
    fetchTasks: async (id) => {
        set({loadingFetchTasks: true});
        try {
            const url = `http://127.0.0.1:8000/api/tasks-lotes`;
            const { data } = await clienteAxios(url,{
                params: {id}
            });
            const result = TasksWeeklyPlanSchema.safeParse(data);
            if(result.success){
                set({loadingFetchTasks: false, tasks: result.data, errorLoadingFetchTasks:false});
            }
        } catch (error) {
            set({loadingFetchTasks: false, errorLoadingFetchTasks:true});
            throw new Error;
        } 
    },
    createPartialClosure: async (id) => {
        set({loadingCreatePartialClosure: true});
        try {
            const url = `http://127.0.0.1:8000/api/tasks-lotes/partial-close/${id}`;
            await clienteAxios.patch(url);
            set({loadingCreatePartialClosure: false, errorCreatePartialClosure: false});
        } catch (error : any) {
            set({loadingCreatePartialClosure: false, errorCreatePartialClosure: true});
            throw new Error;
            
        }
    },
    reloadTasks: async (id) => {
        set({loadingUpdateTask: true});
        try {
            const url = `http://127.0.0.1:8000/api/tasks-lotes`;
            const { data } = await clienteAxios(url,{
                params: {id}
            });
            const result = TasksWeeklyPlanSchema.safeParse(data);
            if(result.success){
                set({loadingUpdateTask: false, tasks: result.data, errorLoadingFetchTasks:false});
            }
        } catch (error) {
            set({loadingUpdateTask: false, errorLoadingFetchTasks:true});
            throw new Error;
        } 
    },
})