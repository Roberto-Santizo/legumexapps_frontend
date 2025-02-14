import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { ProducersPaginateSchema, ProducersSchema } from "../utils/producers-schema";
import { DraftProducer, Producer, ProducersPaginate } from "../types";

export type ProducersSliceType = {
    errorsCreateProductor: string [];
    getProducersPaginate: (page : number) => Promise<ProducersPaginate>;
    createProducer: (data : DraftProducer) => Promise<void>;
    getAllProducers: () => Promise<Producer[]>;
}

export const createProducerSlice: StateCreator<ProducersSliceType> = (set) => ({
    errorsCreateProductor: [],
    getProducersPaginate: async (page) =>{
        try {
            const url = `/api/producers?page=${page}`;
            const { data } = await clienteAxios(url);
            const result = ProducersPaginateSchema.safeParse(data);
            if(result.success){
                return result.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },
    getAllProducers: async () => {
        try {
            const url = '/api/producers-all';
            const { data } = await clienteAxios(url);
            const result = ProducersSchema.safeParse(data);
            if(result.success){
                return result.data.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },
    createProducer: async (data) => {
        try {
            const url = '/api/producers';
            await clienteAxios.post(url,data);
            set({errorsCreateProductor:[]});
        } catch (error : any) {
            set({errorsCreateProductor:Object.values(error.response.data.errors)});
            throw error;
        }
    }
})