import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { DefectsSchema } from "../utils/defectos-schema";
import { Defect, Product } from "@/types";

export type DefectoSliceType = {
    getDefectsByQualityProduct: (id : Product['id']) => Promise<Defect[]>;
}

export const createDefectoSliceType: StateCreator<DefectoSliceType> = () => ({
    getDefectsByQualityProduct: async (id) => {
        try {
            const url = `/api/defects-by-product/${id}`;
            const { data } = await clienteAxios(url);
            const result = DefectsSchema.safeParse(data);
            if(result.success){
                return result.data.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    }
})