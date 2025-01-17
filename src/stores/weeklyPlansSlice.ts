import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { SummaryWeeklyPlanType, WeeklyPlan } from "../types";
import { SummaryWeeklyPlan, WeeklyPlans } from "../utils/weekly_plans-schema";

export type WeeklyPlansSliceType = {
    weeklyPlans: WeeklyPlan[];

    loadingFetchPlans: boolean;
    loadingCreatePlan: boolean;
    loadingFetchPlan: boolean;

    errorFetchPlans: boolean;
    errorCreatePlan: boolean;
    errorFetchPlan: boolean;

    errorsCreatePlan: string[];

    uploadedFile: File;

    fetchPlans: () => Promise<void>;
    createPlan: (file: File[]) => Promise<void>;
    getPlan: (id: WeeklyPlan['id']) => Promise<SummaryWeeklyPlanType>;
}


export const createWeeklyPlansSlice: StateCreator<WeeklyPlansSliceType> = (set) => ({
    weeklyPlans: [],
    loadingFetchPlans: false,
    loadingCreatePlan: false,
    loadingFetchPlan: false,

    errorFetchPlans: false,
    errorCreatePlan: false,
    errorFetchPlan: false,

    errorsCreatePlan: [],

    uploadedFile: {} as File,

    fetchPlans: async () => {
        set({ loadingFetchPlans: true });
        try {
            const url = '/api/plans';
            const { data } = await clienteAxios(url);
            const result = WeeklyPlans.safeParse(data);
            if (result.success) {
                set({ loadingFetchPlans: false, errorFetchPlans: false, weeklyPlans: result.data.data })
            }
        } catch (error: any) {
            set({ loadingFetchPlans: false, errorFetchPlans: true });
            throw error;
        }
    },
    createPlan: async (file) => {
        set({ loadingCreatePlan: true, uploadedFile: file[0] });
        try {
            const url = '/api/plans';
            const formData = new FormData();
            formData.append("file", file[0]);

            await clienteAxios.post(url, formData);
            set({ loadingCreatePlan: false, errorCreatePlan: false, uploadedFile: {} as File })
        } catch (error: any) {
            console.log(error);
            set({ errorsCreatePlan: error.response.data.message, loadingCreatePlan: false, errorCreatePlan: true, uploadedFile: {} as File })
            throw error;
        }
    },
    getPlan: async (id) => {
        set({ loadingFetchPlan: true });
        try {
            const url = `/api/plans/${id}`;
            const { data } = await clienteAxios(url);
            const result = SummaryWeeklyPlan.safeParse(data);
            if (result.success) {
                set({ loadingFetchPlan: false, errorFetchPlan: false });
                return {
                    data: result.data.data
                }
            } else {
                set({ loadingFetchPlan: false, errorFetchPlan: true });
                return { data: { year: 0, week: 0, finca: '', summary: [] } };
            }
        } catch (error) {
            set({ loadingFetchPlan: false, errorFetchPlan: true });
            throw error;
        }
    }

})