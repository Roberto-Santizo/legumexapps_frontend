import { StateCreator } from "zustand";
import { Defect, DefectsPaginate, DraftDefecto, QualityVariety } from "../types";
import clienteAxios from "../config/axios";
import { DefectsPaginateSchema, DefectsSchema } from "../utils/defectos-schema";

export type DefectoSliceType = {
    createDefecto: (data: DraftDefecto) => Promise<void>
    getDefectsPaginate: (page: number) => Promise<DefectsPaginate>
    getDefectsByQualityVarietyId: (id : QualityVariety['id']) => Promise<Defect[]>;
}

export const createDefectoSliceType: StateCreator<DefectoSliceType> = () => ({
    createDefecto: async (data) => {
        try {
            const url = '/api/defects';
            await clienteAxios.post(url, data);
        } catch (error) {
            throw error;
        }
    },
    getDefectsPaginate: async (page) => {
        try {
            const url = `/api/defects?page=${page}`;
            const { data } = await clienteAxios(url);
            const result = DefectsPaginateSchema.safeParse(data);
            if(result.success){
                return result.data
            }else{
                throw new Error('Información no válida');
            }
        } catch (error) {
            throw error;
        }
    },
    getDefectsByQualityVarietyId: async (id) => {
        try {
            const url = `/api/defects-by-variety/${id}`;
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