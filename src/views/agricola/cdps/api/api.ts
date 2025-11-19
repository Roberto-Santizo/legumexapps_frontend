import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { CropsSchema } from "@/utils/cropSchemas";
import { RecipesSchema } from "@/utils/recipeSchemas";
import { LoteCDPDetailsSchema } from "@/utils/lotesSchemas";
import { DraftCDP, FiltersCDPType, PlantationControl } from "../types/types";
import { PlantationControlDetailsSchema, PlantationsControlSchema } from "../schemas/schemas";
import { ApiResponseSchema } from "@/schemas/httpRequestsSchemas";

export async function createCDP(cdp: DraftCDP) {
    try {
        const url = '/api/cdps'
        const { data } = await clienteAxios.post<string>(url, cdp);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }

        throw new Error("Error no controlado");
    }
}

export async function getCdpById(id: PlantationControl['id']) {
    try {
        const url = `/api/cdps/${id}`;
        const { data } = await clienteAxios(url);

        const result = PlantationControlDetailsSchema.safeParse(data);

        if (result.success) {
            return result.data.response;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }

        throw new Error("Error no controlado");
    }
}

export async function updateCDP({ id, data }: { id: PlantationControl['id'], data: DraftCDP }) {
    try {
        const url = `/api/cdps/${id}`;
        const response = await clienteAxios.put<string>(url, data);

        const result = ApiResponseSchema.safeParse(response.data);

        if (result.success) {
            return result.data.message;
        }else{
            throw new Error("Error al actualizar el CDP");
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }

        throw new Error("Error no controlado");
    }
}

export async function uploadCDPS(file: File[]) {
    try {
        const url = '/api/cdps/upload';
        const formData = new FormData();
        formData.append("file", file[0]);
        const { data } = await clienteAxios.post<string>(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }

        throw new Error("Error no controlado");
    }
}

export async function getCDPS({ page, filters, paginated }: { page: number, filters: FiltersCDPType, paginated: string }) {
    try {
        const url = `/api/cdps?paginated=${paginated}&page=${page}&cdp=${filters.cdp}&start_date=${filters.start_date}&end_date=${filters.end_date}`;
        const { data } = await clienteAxios(url);
        const result = PlantationsControlSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Error al traer los cdps");
        }
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }

        throw new Error("Error no controlado");
    }
}

export async function getCrops() {
    try {
        const url = '/api/crops'
        const { data } = await clienteAxios(url)
        const result = CropsSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }

        throw new Error("Error no controlado");
    }
}

export async function getRecipes() {
    try {
        const url = '/api/recipes'
        const { data } = await clienteAxios(url)
        const result = RecipesSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("La información no es válida");
        }
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }

        throw new Error("Error no controlado");
    }
}

export async function getCDPInfoByCDPId(lote_plantation_control_id: PlantationControl['id']) {
    try {
        const url = `/api/cdps/${lote_plantation_control_id}`;
        const { data } = await clienteAxios(url)
        const result = LoteCDPDetailsSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }

        throw new Error("Error no controlado");
    }
}