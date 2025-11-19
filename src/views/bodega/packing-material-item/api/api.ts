import { isAxiosError } from "axios";
import { DraftMaterialEmpaque, FiltersPackingMaterialsType, PackingMaterialItem } from "@/views/bodega/packing-material-item/types/types";
import { PaginatedPackingMaterialItemsSchema } from "../schemas/schemas";
import clienteAxios from "@/config/axios";

export async function getPackingMaterials({ currentPage, filters, paginated }: { currentPage: number, filters: FiltersPackingMaterialsType, paginated: string }) {
    try {
        const url = `/api/packing-materials?paginated=${paginated}&page=${currentPage}&name=${filters.name}&code=${filters.code}&status=${filters.status}&supplier=${filters.supplier}`;
        const { data } = await clienteAxios(url);
        const result = PaginatedPackingMaterialItemsSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.msg);
        }
        
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

export async function updateMaterialStatus(id: PackingMaterialItem['id']) {
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