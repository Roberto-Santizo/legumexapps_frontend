import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { SummaryWeeklyPlanType, WeeklyPlan, WeeklyPlans } from "../types";
import { SummaryWeeklyPlan, WeeklyPlansSchema } from "../utils/weekly_plans-schema";

export type WeeklyPlansSliceType = {

    errorsCreatePlan: string[];
    
    getPlanById: (id: WeeklyPlan['id']) => Promise<SummaryWeeklyPlanType>;
    getAllPlans: (page : number) => Promise<WeeklyPlans>;
    createPlan: (file: File[]) => Promise<void>;

}


export const createWeeklyPlansSlice: StateCreator<WeeklyPlansSliceType> = (set) => ({
    errorsCreatePlan: [],

    getAllPlans: async (page) => {
        try {
            const url = `/api/plans?page=${page}`;
            const { data } = await clienteAxios(url);
            const result = WeeklyPlansSchema.safeParse(data);
            if (result.success) {
                return result.data
            } else {
                throw new Error('Error datos no válidos');
            }
        } catch (error: any) {
            throw error;
        }
    },

    getPlanById: async (id) => {
        try {
            const url = `/api/plans/${id}`;
            const { data } = await clienteAxios(url);
            const result = SummaryWeeklyPlan.safeParse(data);

            if (result.success) {
                return result.data
            }else{
                throw new Error('Los datos no son validos');
            }
        } catch (error) {
            throw error;
        }
    },

    createPlan: async (file) => {
        try {
            const url = '/api/plans';
            const formData = new FormData();
            formData.append("file", file[0]);

            await clienteAxios.post(url, formData);
            set({ errorsCreatePlan: []})
        } catch (error: any) {
            set({ errorsCreatePlan: error.response.data.message})
            throw error;
        }
    },

})