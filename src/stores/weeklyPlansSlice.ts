import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { Permission, SummaryWeeklyPlanType, WeeklyPlan, WeeklyPlansPaginate } from "../types";
import { SummaryWeeklyPlan, WeeklyPlansPaginateSchema, WeeklyPlansSchema } from "../utils/weekly_plans-schema";
import { ReportSchema } from "../utils/reports-schema";
import { downloadBase64File } from "../helpers";

export type WeeklyPlansSliceType = {

    errorsCreatePlan: string[];
    
    getPlanById: (id: WeeklyPlan['id']) => Promise<SummaryWeeklyPlanType>;
    getAllPlansPagination: (page : number, permission : Permission['name']) => Promise<WeeklyPlansPaginate>;
    getAllPlans: () => Promise<WeeklyPlan[]>
    createPlan: (file: File[]) => Promise<void>;
    downloadReport: (data : WeeklyPlan['id'][]) => Promise<void>;
}


export const createWeeklyPlansSlice: StateCreator<WeeklyPlansSliceType> = (set) => ({
    errorsCreatePlan: [],

    getAllPlansPagination: async (page,permission) => {
        try {
            const url = `/api/plans?page=${page}`;
            const { data } = await clienteAxios(url,{
                params:{
                    permission: permission
                }
            });
            const result = WeeklyPlansPaginateSchema.safeParse(data);
            if (result.success) {
                return result.data
            } else {
                throw new Error('Error datos no válidos');
            }
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    },
    getAllPlans: async () => {
        try {
            const url = `/api/plans-list/all`;
            const { data } = await clienteAxios(url);
            const result = WeeklyPlansSchema.safeParse(data);
            if (result.success) {
                return result.data.data
            } else {
                throw new Error('Error datos no válidos');
            }
        } catch (error: any) {
            console.log(error);
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
        } catch (error){
            console.log(error);
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
            console.log(error);
            set({ errorsCreatePlan: error.response.data.message})
            throw error;
        }
    },
    downloadReport: async (weekly_plans_ids) => {
        try {
            const url = '/api/report/plans';
            const { data } = await clienteAxios.post(url,{
                data: weekly_plans_ids
            });
            const result = ReportSchema.safeParse(data);
            if(result.success){
                downloadBase64File(result.data.file,result.data.fileName)
            }else{
                throw new Error('Información no válida');
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

})