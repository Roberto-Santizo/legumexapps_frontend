import clienteAxios from "@/config/axios";
import { CDP, DraftLote, Finca, Lote, loteCDPDetails, PaginatedLotes } from "@/types";
import { LoteCDPDetailsSchema } from "@/utils/loteCDPDetails-schema";
import { LotesPaginateSchema, LotesSchema, LotesSchemaSelect } from "@/utils/lotes-schema";
import { CDPsSchema } from "@/utils/plantation-schema";


export async function createLote(draftlote: DraftLote): Promise<void | string[]> {
    try {
        const url = '/api/lotes';
        await clienteAxios.post(url, draftlote);
    } catch (error: any) {
        return Object.values(error.response.data.errors);
    }
}

export async function getPaginatedLotes(page: number): Promise<PaginatedLotes> {
    try {
        const url = `/api/lotes?page=${page}`;
        const { data } = await clienteAxios(url)
        const result = LotesPaginateSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error('Información no válida');
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export async function getAllLotes(): Promise<Lote[]> {
    try {
        const url = '/api/lotes-all';
        const { data } = await clienteAxios(url);
        const result = LotesSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllLotesByFincaId(id: Finca['id']): Promise<Lote[]> {
    try {
        const url = `/api/lotes/finca/${id}`;
        const { data } = await clienteAxios(url);
        const result = LotesSchemaSelect.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllCdpsByLoteId(id: Lote['id']): Promise<CDP[]> {
    try {
        const url = `/api/cdps/lote/${id}`;
        const { data } = await clienteAxios(url);
        const result = CDPsSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getCDPInfoByCDPId(lote_plantation_control_id: CDP['id']): Promise<loteCDPDetails> {
    try {
        const url = '/api/cdp/info';
        const { data } = await clienteAxios(url, {
            params: { lote_plantation_control_id }
        })
        const result = LoteCDPDetailsSchema.safeParse(data);
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

export async function updateLotes(file: File[]) {
    try {
        const url = '/api/lotes-all/update';
        const formData = new FormData();
        formData.append("file", file[0]);
        await clienteAxios.post(url, formData);
    } catch (error: any) {
        console.log(error);
        return error.response.data.message;
    }
}
