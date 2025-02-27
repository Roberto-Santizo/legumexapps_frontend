import clienteAxios from "@/config/axios";
import { DraftBoletaTransporte, DraftTransporteCondicion, TransporteCondition, TransporteConditionsPaginate, TransporteInspectionPaginate } from "@/types";
import { TransporteConditionsPaginateSchema, TransporteConditionsSchema, TransporteInspectionsPaginateSchema } from "@/utils/transportecondicion-schema";

export async function createBoletaTransporte(data : DraftBoletaTransporte) {
    try {
        const url = '/api/transport-inspection';
        await clienteAxios.post(url,data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createTransporteCondicion(data : DraftTransporteCondicion) {
    try {
        const url = '/api/transport-conditions';
        await clienteAxios.post(url,data);
    } catch (error) {
        console.log(error);
        throw error;
    }
    
}

export async function getPaginatedTransporteCondiciones(page : number) : Promise<TransporteConditionsPaginate> {
    try {
        const url = `/api/transport-conditions?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = TransporteConditionsPaginateSchema.safeParse(data);
        if(result.success){
            return result.data
        }else{
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getPaginatedTransporteInspections(page : number) : Promise<TransporteInspectionPaginate> {
    try {
        const url = `/api/transport-inspection?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = TransporteInspectionsPaginateSchema.safeParse(data);
        if(result.success){
            return result.data
        }else{
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTransporteCondiciones() : Promise<TransporteCondition[]> {
    try {
        const url = `/api/transport-conditions-all`;
        const { data } = await clienteAxios(url);
        const result = TransporteConditionsSchema.safeParse(data);
        if(result.success){
            return result.data.data
        }else{
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}