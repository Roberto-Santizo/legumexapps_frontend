import clienteAxios from "@/config/axios";
import { DraftInputs } from "@/views/bodega/formularios/CrearInsumo";
import { isAxiosError } from "axios";
import { z } from "zod";

export async function createReceptionInsumos(FormData: DraftInputs) {
    try {
        const url = '/api/tareas';
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

export async function getPaginatedInsumosReceipts(page: number): Promise<PaginatedInsumosReceipts> {
    try {
        const url = `/api/insumos-reception?page=${page}`;
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
    unit_value: z.number(),
    total: z.number()
});

export const InsumosReceiptDetailsSchema = z.object({
    data: z.object({
        id: z.string(),
        received_date: z.string(),
        invoice: z.string(),
        supplier: z.string(),
        invoice_date: z.string(),
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