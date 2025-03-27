import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { DraftClient } from "views/produccion/clientes/CrearCliente";
import { z } from "zod";

export const ClientSchema = z.object({
    name: z.string()
})

export const PaginatedClientsSchema = z.object({
    data: z.array(ClientSchema),
    meta: z.object({
        current_page: z.number(),
        last_page: z.number()
    })
});

export type Client = z.infer<typeof ClientSchema>;
export type PaginatedClients = z.infer<typeof PaginatedClientsSchema>;

export async function getPaginatedClients(page : number) : Promise<PaginatedClients> {
    try {
        const url = `/api/clients?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = PaginatedClientsSchema.safeParse(data);
        if(result.success){
            return result.data
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const ClientSelectSchema = z.object({
    value: z.string(),
    label: z.string()
});

export const ClientsSelectSchema = z.object({
    data: z.array(ClientSelectSchema)
});

export type ClientSelect = z.infer<typeof ClientSelectSchema>;

export async function getAllClients() : Promise<ClientSelect[]> {
    try {
        const url = `/api/clients-all`;
        const { data } = await clienteAxios(url);
        const result = ClientsSelectSchema.safeParse(data);
        if(result.success){
            return result.data.data
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createClient(formData : DraftClient) {
    try {
        const url = `/api/clients`;
        const { data } = await clienteAxios.post<string>(url,formData);
        return data;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.msg);
        }
    }
}