import { DraftEditLineSku } from "@/components/modals/ModalEditLineSkuData";
import { DraftLineaSku } from "@/views/produccion/lines-performances/Create";
import { FiltersLinesPerformance } from "@/views/produccion/lines-performances/Index";
import { isAxiosError } from "axios";
import { LinePerformance } from "@/types/linePerformanceTypes";
import { PaginatedLinesPerformancesSchema } from "@/utils/linePerformance";
import clienteAxios from "@/config/axios";

export async function getPaginatedLineasSKU({ page, filters }: { page: number, filters: FiltersLinesPerformance }) {
    try {
        const url = `/api/lines-skus?page=${page}&sku=${filters.sku}&line=${filters.line}`;
        const { data } = await clienteAxios(url);
        const result = PaginatedLinesPerformancesSchema.safeParse(data);
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

export async function createLineaSku(FormData: DraftLineaSku) {
    try {
        const url = '/api/lines-skus';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function updateLineaSku({ FormData, id }: { FormData: DraftEditLineSku, id: LinePerformance['id'] }) {
    try {
        const url = `/api/lines-skus/${id}`;
        const { data } = await clienteAxios.patch(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function uploadRelacionesLineSku(file: File[]) {
    try {
        const url = '/api/lines-skus/upload';
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