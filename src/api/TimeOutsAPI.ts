import { PaginatedTimeoutsSchema, TimeoutSchema } from "@/utils/timeOutSchema";
import { isAxiosError } from "axios";
import { TaskProductionPlan } from "types/taskProductionPlanTypes";
import { Timeout } from "types/timeoutsTypes";
import { DraftTiempoMuerto } from "views/produccion/tiempos_muertos/CrearTiempoMuerto";
import { z } from "zod";
import clienteAxios from "@/config/axios";



export async function getTimeOuts({page,paginated} : {page: number,paginated:string}) {
    try {
        const url = `/api/timeouts?paginated=${paginated}&page=${page}`;
        const { data } = await clienteAxios(url);
        const result = PaginatedTimeoutsSchema.safeParse(data);
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

export const TimeoutSelectSchema = z.object({
    value: z.string(),
    label: z.string()
})

export async function getTimeoutById(id: Timeout['id']) {
    try {
        const url = `/api/timeouts/${id}`;
        const { data } = await clienteAxios(url);
        const result = TimeoutSchema.safeParse(data.data);
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

export async function createTimeOut(FormData: DraftTiempoMuerto) {
    try {
        const url = '/api/timeouts';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function updateTimeOut({ id, FormData }: { id: Timeout['id'], FormData: DraftTiempoMuerto }) {
    try {
        const url = `/api/timeouts/${id}`;
        const { data } = await clienteAxios.put<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function createTaskTimeout({ id, timeout_id }: { id: TaskProductionPlan['id'], timeout_id: Timeout['id'] }) {
    try {
        const url = `/api/tasks-production/${id}/add-timeout/open`;
        await clienteAxios.post(url, {
            timeout_id: timeout_id
        })
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg)
        }
    }
}

export async function closeTaskTimeOut(id: TaskProductionPlan['id']) {
    try {
        const url = `/api/tasks-production/${id}/add-timeout/close`;
        const { data } = await clienteAxios.post<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg)
        }
    }
}