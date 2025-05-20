import clienteAxios from "@/config/axios";
import { DraftRecepcionInsumos } from "@/views/bodega/recepcion-insumos/CrearRecepcionInsumos";
import { isAxiosError } from "axios";
import { z } from "zod";
import {FiltersReceptionsInsumos} from "@/views/bodega/recepcion-insumos/IndexRecepcionInsumos"

export async function createReceptionInsumos(FormData: DraftRecepcionInsumos) {
    try {
        const url = '/api/insumos-reception';
        const { data } = await clienteAxios.post<string>(url, FormData)
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export const InsumosReceiptSchema = z.object({
    id: z.string(),
    received_by: z.string(),
    invoice: z.string(),
    supplier: z.string(),
    received_date: z.string(),
    invoice_date: z.string()
});

export const PaginatedInsumosReceiptsSchema = z.object({
    data: z.array(InsumosReceiptSchema),
    meta: z.object({
        current_page: z.number(),
        last_page: z.number()
    })
});

export type PaginatedInsumosReceipts = z.infer<typeof PaginatedInsumosReceiptsSchema>;
export type InsumosReceipt = z.infer<typeof InsumosReceiptSchema>;

export async function getPaginatedInsumosReceipts(page: number, filters: FiltersReceptionsInsumos): Promise<PaginatedInsumosReceipts> {
    try {
        const url = `/api/insumos-reception?page=${page}&invoice=${filters.invoice}&received_by=${filters.received_by}&received_date=${filters.received_date}&invoice_date=${filters.invoice_date}`;
        const { data } = await clienteAxios(url);
        const result = PaginatedInsumosReceiptsSchema.safeParse(data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Hubo un error al trear los insumos');
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export const ItemInsumosReceiptSchema = z.object({
    id: z.string(),
    code: z.string(),
    measure: z.string(),
    name: z.string(),
    units: z.number(),
});

export const InsumosReceiptDetailsSchema = z.object({
    data: z.object({
        id: z.string(),
        received_date: z.string(),
        invoice: z.string(),
        supplier: z.string(),
        invoice_date: z.string(),
        supervisor_signature: z.string(),
        user_signature: z.string(),
        items: z.array(ItemInsumosReceiptSchema)
    })
});

export type InsumosReceiptDetails = z.infer<typeof InsumosReceiptDetailsSchema>;

export async function getInsumosReceiptById(id: InsumosReceipt['id']) : Promise<InsumosReceiptDetails> {
    try {
        const url = `/api/insumos-reception/${id}`;
        const { data } = await clienteAxios(url);
        const result = InsumosReceiptDetailsSchema.safeParse(data);
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