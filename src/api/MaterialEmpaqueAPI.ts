import clienteAxios from "@/config/axios";
import { DraftMaterialEmpaque } from "@/views/bodega/material-empaque/CrearRegistroMaterial";
import { FiltersPackingMaterialsType } from "@/views/bodega/material-empaque/IndexMaterialEmpaque";
import { isAxiosError } from "axios";
import { z } from "zod";

export const PackingMaterialSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    description: z.string(),
    blocked: z.boolean(),
});

export const PaginatedPackingMaterialsSchema = z.object({
    data: z.array(PackingMaterialSchema),
    meta: z.object({
        current_page: z.number(),
        last_page: z.number()
    }).optional()
});

export type PackingMaterial = z.infer<typeof PackingMaterialSchema>;
export type PaginatedPackingMaterials = z.infer<typeof PaginatedPackingMaterialsSchema>;

export async function getPackingMaterials({ currentPage, filters, paginated }: { currentPage: number, filters: FiltersPackingMaterialsType, paginated: string }): Promise<PaginatedPackingMaterials> {
    try {
        const url = `/api/packing-materials?paginated=${paginated}&page=${currentPage}&name=${filters.name}&code=${filters.code}&status=${filters.status}&supplier=${filters.supplier}`;
        const { data } = await clienteAxios(url);
        const result = PaginatedPackingMaterialsSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createItemPackingMaterial(FormData: DraftMaterialEmpaque) {
    try {
        const url = '/api/packing-materials';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function updateMaterialStatus(id: PackingMaterial['id']) {
    try {
        const url = `/api/packing-materials/${id}`;
        const { data } = await clienteAxios.patch<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function uploadItemsMP(file: File[]) {
    try {
        const url = '/api/packing-materials/upload';
        const formData = new FormData();
        formData.append("file", file[0]);
        const { data } = await clienteAxios.post(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else if (error.response?.data.msg) {
                throw new Error(error.response?.data.msg);
            }
        }
    }
}