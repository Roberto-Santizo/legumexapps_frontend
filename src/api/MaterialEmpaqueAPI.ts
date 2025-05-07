import clienteAxios from "@/config/axios";
import { DraftMaterialRegister } from "@/views/bodega/formularios/CrearRegistroMaterial";
import { FiltersPackingMaterials } from "@/views/bodega/material-empaque/IndexMaterialEmpaque";
import { isAxiosError } from "axios";
import { z } from "zod";

export const PackingMaterialSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    description: z.string(),
    blocked: z.boolean()
});

export const PaginatedPackingMaterialsSchema = z.object({
    data: z.array(PackingMaterialSchema),
    meta: z.object({
        current_page: z.number(),
        last_page: z.number()
    })
});

export type PackingMaterial = z.infer<typeof PackingMaterialSchema>;
export type PaginatedPackingMaterials = z.infer<typeof PaginatedPackingMaterialsSchema>;

export async function getPaginatedPackingMaterials({ currentPage, filters }: { currentPage: number, filters: FiltersPackingMaterials }): Promise<PaginatedPackingMaterials> {
    try {
        const url = `/api/packing-materials?page=${currentPage}&name=${filters.name}&code=${filters.code}&status=${filters.status}`;
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

export async function createItemPackingMaterial(FormData: DraftMaterialRegister) {
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