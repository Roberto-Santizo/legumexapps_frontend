import clienteAxios from "@/config/axios";
import { z } from "zod";


export const DraftBoletaTransportSchema = z.object({
    planta_id: z.string(),
    product_id: z.string(),
    rm_reception_id: z.string(),
    pilot_name: z.string(),
    truck_type: z.string(),
    plate: z.string(),
    observations: z.string().nullable(),
    verify_by_signature: z.string(),
    quality_manager_signature: z.string()
});

export type DraftBoletaTransporte = z.infer<typeof DraftBoletaTransportSchema>


export async function createBoletaTransporte(data: DraftBoletaTransporte) {
    try {
        const url = '/api/transport-inspection';
        await clienteAxios.post(url, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const DraftTransporteCondicionSchema = z.object({
    name: z.string(),
});

export type DraftTransporteCondicion = z.infer<typeof DraftTransporteCondicionSchema>

export async function createTransporteCondicion(data: DraftTransporteCondicion) {
    try {
        const url = '/api/transport-conditions';
        await clienteAxios.post(url, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const TransporteConditionSchema = z.object({
    id: z.string(),
    name: z.string()
});

export const TransporteConditionsPaginateSchema = z.object({
    data: z.array(TransporteConditionSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export type TransporteConditionsPaginate = z.infer<typeof TransporteConditionsPaginateSchema>

export async function getPaginatedTransporteCondiciones(page: number): Promise<TransporteConditionsPaginate> {
    try {
        const url = `/api/transport-conditions?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = TransporteConditionsPaginateSchema.safeParse(data);
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


export const TransporteInspectionSchema = z.object({
    id:z.string(),
    pilot_name: z.string(),
    truck_type: z.string(),
    plate: z.string(),
    date: z.string(),
    product: z.string(),
    variety: z.string(),
    finca: z.string(),
    planta: z.string()
});

export const TransporteInspectionsPaginateSchema = z.object({
    data: z.array(TransporteInspectionSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export type TransporteInspectionPaginate = z.infer<typeof TransporteInspectionsPaginateSchema>

export async function getPaginatedTransporteInspections(page: number): Promise<TransporteInspectionPaginate> {
    try {
        const url = `/api/transport-inspection?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = TransporteInspectionsPaginateSchema.safeParse(data);
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


export const TransporteConditionsSchema = z.object({
    data: z.array(TransporteConditionSchema)
});

export type TransporteCondition = z.infer<typeof TransporteConditionSchema>

export type TransporteInspection = z.infer<typeof TransporteInspectionSchema>

export async function getTransporteCondiciones(): Promise<TransporteCondition[]> {
    try {
        const url = `/api/transport-conditions-all`;
        const { data } = await clienteAxios(url);
        const result = TransporteConditionsSchema.safeParse(data);
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