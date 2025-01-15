import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { WeeklyPlan } from "../types";
import { WeeklyPlans } from "../utils/weekly_plans-schema";

export type WeeklyPlansSliceType = {
    weeklyPlans: WeeklyPlan[];

    loadingFetchPlans: boolean;
    loadingCreatePlan: boolean;

    errorFetchPlans: boolean;
    errorCreatePlan: boolean;

    uploadedFile: File;

    fetchPlans: () => Promise<void>;
    createPlan: (file : File[]) => Promise<void>;
}


export const createWeeklyPlansSlice: StateCreator<WeeklyPlansSliceType> = (set) => ({
    weeklyPlans: [],
    loadingFetchPlans: false,
    loadingCreatePlan: false,

    errorFetchPlans: false,
    errorCreatePlan: false,
    uploadedFile: {} as File,

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
    },
    createPlan: async (file) =>{
        set({loadingCreatePlan: true, uploadedFile: file[0]});
        try {
            const url = '/api/plans';
            const formData = new FormData();
            formData.append("file", file[0]); 
    
            await clienteAxios.post(url,formData);
            set({loadingCreatePlan: false,errorCreatePlan:false, uploadedFile: {} as File})
        } catch (error : any) {
            set({loadingCreatePlan: false,errorCreatePlan:true})
        }
    }

})