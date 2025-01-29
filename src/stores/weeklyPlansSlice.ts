import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { SummaryWeeklyPlanType, WeeklyPlan } from "../types";
import { SummaryWeeklyPlan, WeeklyPlans } from "../utils/weekly_plans-schema";

export type WeeklyPlansSliceType = {

    //TREAR PLANES
    loadinggetAllPlans: boolean;
    errorgetAllPlans: boolean,
    getAllPlans: () => Promise<WeeklyPlan[]>;

    //TREAR PLAN
    loadingFetchPlan: boolean;
    errorFetchPlan: boolean;
    getPlanById: (id: WeeklyPlan['id']) => Promise<SummaryWeeklyPlanType>;


    //CREAR PLAN
    loadingCreatePlan: boolean;
    errorCreatePlan: boolean;
    errorsCreatePlan: string[];
    createPlan: (file: File[]) => Promise<void>;

}


export const createWeeklyPlansSlice: StateCreator<WeeklyPlansSliceType> = (set) => ({
    weeklyPlan: {} as SummaryWeeklyPlanType,
    loadinggetAllPlans: false,
    loadingCreatePlan: false,
    loadingFetchPlan: false,
    errorgetAllPlans: false,


    errorCreatePlan: false,
    errorFetchPlan: false,

    errorsCreatePlan: [],

    getAllPlans: async () => {
        set({ loadinggetAllPlans: true });
        try {
            const url = '/api/plans';
            const { data } = await clienteAxios(url);
            const result = WeeklyPlans.safeParse(data);
            if (result.success) {
                set({ loadinggetAllPlans: false, errorgetAllPlans: false });
                return result.data.data;
            } else {
                set({ loadinggetAllPlans: false, errorgetAllPlans: true });
                return [];
            }
        } catch (error: any) {
            set({ loadinggetAllPlans: false, errorgetAllPlans: true });
            throw error;
        }
    },

    getPlanById: async (id) => {
        set({ loadingFetchPlan: true });
        try {
            const url = `/api/plans/${id}`;
            const { data } = await clienteAxios(url);
            const result = SummaryWeeklyPlan.safeParse(data);

            if (result.success) {
                set({ loadingFetchPlan: false, errorFetchPlan: false });
                return result.data
            }else{
                set({ loadingFetchPlan: false, errorFetchPlan: false });
                throw new Error('Los datos no son validos');
            }
        } catch (error) {
            set({ loadingFetchPlan: false, errorFetchPlan: true });
            throw error;
        }
    },

    createPlan: async (file) => {
        set({ loadingCreatePlan: true });
        try {
            const url = '/api/plans';
            const formData = new FormData();
            formData.append("file", file[0]);

            await clienteAxios.post(url, formData);
            set({ loadingCreatePlan: false, errorCreatePlan: false})
        } catch (error: any) {
            console.log(error);
            set({ errorsCreatePlan: error.response.data.message, loadingCreatePlan: false, errorCreatePlan: true})
            throw error;
        }
    },

})