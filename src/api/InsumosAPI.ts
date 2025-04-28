import { isAxiosError } from "axios";
import { z } from "zod";
import clienteAxios from "@/config/axios";
import { FiltersInsumosType } from "@/views/agricola/insumos/IndexInsumos";


export const InsumoSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    measure: z.string()
});

export type Insumo = z.infer<typeof InsumoSchema>;
export type DraftInsumo = Omit<Insumo, 'id'>;

export async function createInsumo(FormData: DraftInsumo) {
    try {
        const url = `/api/insumos`;
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function uploadInsumos(file: File[]) {
    try {
        const url = "/api/insumos/upload";
        const formData = new FormData();
        formData.append("file", file[0]);
        const { data } = await clienteAxios.post<string>(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export const AllInsumosSchema = z.object({
    data: z.array(InsumoSchema)
});


export async function getAllInsumos(): Promise<Insumo[]> {
    try {
        const url = '/api/insumos-all';
        const { data } = await clienteAxios(url);
        const result = AllInsumosSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const InsumosSchema = z.object({
    data: z.array(InsumoSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export type Insumos = z.infer<typeof InsumosSchema>;

export async function getPaginatedInsumos(currentPage: number, filters:FiltersInsumosType): Promise<Insumos> {
    try {
        const url = `/api/insumos?page=${currentPage}&code=${filters.code}&name=${filters.name}`;
        console.log(url);
        const { data } = await clienteAxios(url);
        const result = InsumosSchema.safeParse(data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        throw error;
    }
}