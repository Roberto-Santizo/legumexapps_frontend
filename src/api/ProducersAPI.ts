import clienteAxios from "@/config/axios";
import { DraftProducer } from "@/views/calidad/producers/Create";
import { isAxiosError } from "axios";
import { z } from "zod";

export async function createProducer(FormData: DraftProducer) {
    try {
        const url = '/api/producers';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export const ProducerSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string()
});

export type Producer = z.infer<typeof ProducerSchema>

export const ProducersPaginateSchema = z.object({
    data: z.array(ProducerSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional()
});

export type ProducersPaginate = z.infer<typeof ProducersPaginateSchema>


export async function getProducers({ page, paginated }: { page: number, paginated: string }): Promise<ProducersPaginate> {
    try {
        const url = `/api/producers?paginated=${paginated}&page=${page}`;
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