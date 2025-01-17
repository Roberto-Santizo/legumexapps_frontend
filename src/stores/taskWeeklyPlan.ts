import { StateCreator } from "zustand"
import clienteAxios from "../config/axios"
import { TaskWeeklyPlan } from "../types"
import { TasksWeeklyPlanSchema } from "../utils/taskWeeklyPlan-schema";

export type TaskWeeklyPlanSliceType = {

    loadingFetchTasks: boolean;

    fetchTasks: (id : TaskWeeklyPlan['id']) => Promise<TaskWeeklyPlan[]>
}


export const createTaskWeeklyPlanSlice: StateCreator<TaskWeeklyPlanSliceType> = (set) => ({
    loadingFetchTasks: false,
    fetchTasks: async (id) => {
        set({loadingFetchTasks: true});
        try {
            const url = `http://127.0.0.1:8000/api/tasks-lotes/${id}`;
            const { data } = await clienteAxios(url);
            const result = TasksWeeklyPlanSchema.safeParse(data);
            if(result.success){
                set({loadingFetchTasks: false})
                return result.data.data
            }else{
                set({loadingFetchTasks: false});
                return []
            }
        } catch (error) {
            return [];
        } 
    }
})