import { FiltersBoletaRMP } from "@/components/filters/FiletrsRMP";
import { BoletaInfoAllSchema, BoletaRMPDetailSchema, BoletasPaginateSchema, QualityStatusesSchema } from "@/utils/rmpDocSchemas";
import { DraftFormProd } from "@/views/calidad/rmp/Boleta_form2";
import { DraftBoletaControlCalidad } from "@/views/calidad/rmp/Boleta_form3";
import { isAxiosError } from "axios";
import { BoletaRMP, DraftBoletaRMP, ResultBoletaRmpCalidad } from "@/types/rmpDocTypes";
import clienteAxios from "@/config/axios";


export async function createBoletaRMP(FormData: DraftBoletaRMP) {
    try {
        const url = '/api/boleta-rmp';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}


export async function getBoletasRMP({ page, filters, paginated, transport_doc_create }: { page: number, filters: FiltersBoletaRMP, paginated: string, transport_doc_create: string }) {
    try {
        const params = new URLSearchParams({ ...filters });
        const url = `/api/boleta-rmp?paginated=${paginated}&page=${page}&${params.toString()}&transport_doc_create=${transport_doc_create}`;
        const { data } = await clienteAxios(url);
        const result = BoletasPaginateSchema.safeParse(data);
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

export async function getBoletaRMPDetail(id: BoletaRMP['id']) {
    try {
        const url = `/api/boleta-rmp/${id}`;
        const { data } = await clienteAxios(url);
        const result = BoletaRMPDetailSchema.safeParse(data.data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        throw error;
    }
}

export async function createProdData({ FormData, id }: { FormData: DraftFormProd, id: BoletaRMP['id'] }) {
    try {
        const url = `/api/boleta-rmp/prod/${id}`;
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function createQualityDoc({ FormData, id, results }: { FormData: DraftBoletaControlCalidad, id: BoletaRMP['id'], results: ResultBoletaRmpCalidad[] }) {
    try {
        const url = `/api/boleta-rmp/calidad/${id}`;
        const { data } = await clienteAxios.post<string>(url, { data: FormData, results });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function updateGRN({ grn, id }: { grn: string, id: BoletaRMP['id'] }) {
    try {
        const url = `/api/boleta-rmp/generate-grn/${id}`;
        const { data } = await clienteAxios.post<string>(url, { grn });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}


export async function getBoletaInfoAll(id: BoletaRMP['id']) {
    try {
        const url = `/api/boleta-rmp-info-doc/${id}`;
        const { data } = await clienteAxios(url);
        const result = BoletaInfoAllSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error('Información no válida');
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function rejectBoleta(id: BoletaRMP['id']) {
    try {
        const url = `/api/boleta-rmp/${id}/reject`;
        const { data } = await clienteAxios.patch<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function getQualityStatuses() {
    try {
        const url = `/api/quality-statuses`;
        const { data } = await clienteAxios(url);
        const result = QualityStatusesSchema.safeParse(data);
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