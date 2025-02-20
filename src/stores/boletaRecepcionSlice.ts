import { StateCreator } from "zustand";
import { Boleta, BoletaDetail, BoletaInfoAll, BoletasPaginate, DraftBoletaCalidad, DraftBoletaRMP, DraftFormProd, ResultBoletaCalidad } from "../types";
import clienteAxios from "../config/axios";
import { BoletaInfoAllSchema, BoletaRMPDetailSchema, BoletasPaginateSchema } from "../utils/boletarmp-schema";

export type BoletasRecepcionType = {
    getBoletasRMP: () => Promise<BoletasPaginate>;
    createBoletaRMP: (data : DraftBoletaRMP) => Promise<string[]>;
    getBoletaRMPDetail: (id : Boleta['id']) => Promise<BoletaDetail>;
    createProdData: (data : DraftFormProd, id : Boleta['id']) => Promise<void>;
    createQualityDoc: (data : DraftBoletaCalidad, id : Boleta['id'], results : ResultBoletaCalidad[]) => Promise<void>;
    updateGRN: (grn : string, id : Boleta['id']) => Promise<void>;
    getBoletaInfoAll: (id : Boleta['id']) => Promise<BoletaInfoAll>;
}

export const createBoletaRecepcionSlice: StateCreator<BoletasRecepcionType> = () => ({
    getBoletasRMP: async () => {
       try {
            const url = '/api/boleta-rmp';
            const { data } = await clienteAxios(url);
            const result = BoletasPaginateSchema.safeParse(data);
            if(result.success){
                return result.data
            }else{
                throw new Error("Información no válida");
            }
       } catch (error) {
            throw error;
       }
    },
    getBoletaRMPDetail: async (id) => {
        try {
            const url = `/api/boleta-rmp/${id}`;
            const { data } = await clienteAxios(url);
            const result = BoletaRMPDetailSchema.safeParse(data.data);
            if(result.success){
                return result.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },

    createBoletaRMP: async (data) => {
        try {
            const url = '/api/boleta-rmp';
            await clienteAxios.post(url,data);
            return[];
        } catch (error : any) {
           return Object.values(error.response.data.errors);
        }
    },
    createProdData: async (data,id) => {
        try {
            const url =  `/api/boleta-rmp/prod/${id}`;
            await clienteAxios.post(url,data);      
        } catch (error) {
            throw error;
        }
    },
    createQualityDoc: async (data,id,results) => {
        try {
            const url = `/api/boleta-rmp/calidad/${id}`;
            await clienteAxios.post(url,{data,results});
        } catch (error) {
            throw error;
        }
    },
    updateGRN: async (grn,id) => {
        try {
            const url = `/api/boleta-rmp/generate-grn/${id}`;
            await clienteAxios.post(url,{grn});
        } catch (error) {
            throw error;
        }
    },

    getBoletaInfoAll: async (id) => {
        try {
            const url = `/api/boleta-rmp-info-doc/${id}`;
            const { data } = await clienteAxios(url);
            const result = BoletaInfoAllSchema.safeParse(data);
            if(result.success){
                return result.data
            }else{
                throw new Error('Información no válida');
            }
        } catch (error) {
            throw error;
        }
    }
})