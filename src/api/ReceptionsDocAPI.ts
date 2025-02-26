import clienteAxios from "@/config/axios";
import { Boleta, BoletasPaginate, DraftBoletaRMP, DraftFormProd, BoletaDetail, DraftBoletaCalidad, ResultBoletaCalidad } from "@/types";
import { BoletaInfoAllSchema, BoletaRMPDetailSchema, BoletasPaginateSchema } from "@/utils/boletarmp-schema";


export async function createBoletaRMP(data: DraftBoletaRMP): Promise<void | string[]> {
    try {
        const url = '/api/boleta-rmp';
        await clienteAxios.post(url, data);
    } catch (error: any) {
        console.log(error);
        return Object.values(error.response.data.errors);
    }
}

export async function getPaginatedBoletasRMP(page : number, filters: Record<string, any> = {}): Promise<BoletasPaginate> {
    try {
        const params = new URLSearchParams({ page: page.toString(), ...filters });
        const url = `/api/boleta-rmp?${params.toString()}`;
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

export async function getBoletaRMPDetail(id: Boleta['id']): Promise<BoletaDetail> {
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

export async function createProdData(data: DraftFormProd, id: Boleta['id']): Promise<void> {
    try {
        const url = `/api/boleta-rmp/prod/${id}`;
        await clienteAxios.post(url, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createQualityDoc(data: DraftBoletaCalidad, id: Boleta['id'], results: ResultBoletaCalidad[]) {
    try {
        const url = `/api/boleta-rmp/calidad/${id}`;
        await clienteAxios.post(url, { data, results });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateGRN (grn : string, id : Boleta['id']) {
    try {
        const url = `/api/boleta-rmp/generate-grn/${id}`;
        await clienteAxios.post(url, { grn });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getBoletaInfoAll(id : Boleta['id']) {
    try {
        const url = `/api/boleta-rmp-info-doc/${id}`;
        const { data } = await clienteAxios(url);
        const result = BoletaInfoAllSchema.safeParse(data);
        if(result.success){
            return result.data
        }else{
            throw new Error('Información no válida');
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}