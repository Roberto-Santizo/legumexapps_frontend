import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { TasksCropSchema } from "../utils/taskCropWeeklyPlan-schema";
import { TaskCrop } from "../types";

export type TasksCropSliceType = {
    getAllTasksCrop: () => Promise<TaskCrop[]>
}

export const createTasksCropSlice: StateCreator<TasksCropSliceType> = () => ({
   
    getAllTasksCrop: async () => {
        try {
            const url = '/api/tasks-crop-all';
            const { data } = await clienteAxios(url);
            const result = TasksCropSchema.safeParse(data);
            if(result.success){
                return result.data.data
            }else{
                throw new Error('Información no válida');
            }
        } catch (error) {
            console.log(error);
            throw error;
        };
    }
})