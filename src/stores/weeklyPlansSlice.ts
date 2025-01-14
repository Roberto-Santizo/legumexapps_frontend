import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { WeeklyPlan } from "../types";
import { WeeklyPlans } from "../utils/weekly_plans-schema";

export type WeeklyPlansSliceType = {
    weeklyPlans: WeeklyPlan[];

    loadingFetchPlans: boolean,

    errorFetchPlans: boolean;

    fetchPlans: () => Promise<void>;
}


export const createWeeklyPlansSlice: StateCreator<WeeklyPlansSliceType> = (set) => ({
    weeklyPlans: [],
    loadingFetchPlans: false,
    errorFetchPlans: false,
    fetchPlans: async () => {
        set({loadingFetchPlans: true});
        try {
            const url = '/api/plans';
            const { data } = await clienteAxios(url);
            const result = WeeklyPlans.safeParse(data);
            if(result.success){
                set({loadingFetchPlans: false, errorFetchPlans:false,weeklyPlans: result.data.data})
            }
        } catch (error : any) {
            set({loadingFetchPlans: false, errorFetchPlans:true});
            throw error;
        }
    }   

})