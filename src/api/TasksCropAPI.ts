import clienteAxios from "@/config/axios";
import { TaskCrop } from "@/types";
import { TasksCropSchema } from "@/utils/taskCropWeeklyPlan-schema";

export async function getAllTasksCrop() : Promise<TaskCrop[]> {
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
        throw error;
    };
}