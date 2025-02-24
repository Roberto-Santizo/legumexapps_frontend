import clienteAxios from "@/config/axios";
import { DraftProducer, Producer, ProducersPaginate } from "@/types";
import { ProducersPaginateSchema, ProducersSchema } from "@/utils/producers-schema";

export async function createProducer(data : DraftProducer) : Promise<void | string[]> {
    try {
        const url = '/api/producers';
        await clienteAxios.post(url,data);
    } catch (error : any) {
        return Object.values(error.response.data.errors);
    }
}

export async function getPaginatedProducers(page: number) : Promise<ProducersPaginate> {
    try {
        const url = `/api/producers?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = ProducersPaginateSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllProducers() : Promise<Producer[]> {
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
        console.log(error);
        throw error;
    }
}