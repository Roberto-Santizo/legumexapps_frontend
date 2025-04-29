import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { DraftTiempoMuerto } from "views/produccion/tiempos_muertos/CrearTiempoMuerto";
import { z } from "zod";
import { TaskProduction } from "./WeeklyProductionPlanAPI";

export const TimeoutSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const PaginatedTimeoutsSchema = z.object({
    data: z.array(TimeoutSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export type Timeout = z.infer<typeof TimeoutSchema>;
export type PaginatedTimeouts = z.infer<typeof PaginatedTimeoutsSchema>;


export async function getPaginatedTimeouts(page: number): Promise<PaginatedTimeouts> {
    try {
        const url = `/api/timeouts?page=${page}`;
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

export const TimeoutsSelectSchema = z.object({
    data: z.array(TimeoutSelectSchema)
});

export type TimeoutSelect = z.infer<typeof TimeoutSelectSchema>

export async function getAllTimeouts(): Promise<TimeoutSelect[]> {
    try {
        const url = `/api/timeouts-all`;
        const { data } = await clienteAxios(url);
        const result = TimeoutsSelectSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Informació no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTimeoutById(id: Timeout['id']): Promise<Timeout> {
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

export async function createTaskTimeout({ id, timeout_id }: { id: TaskProduction['id'], timeout_id: Timeout['id'] }) {
    try {
        const url = `/api/tasks_production_plan/${id}/add-timeout/open`;
        await clienteAxios.post(url, {
            timeout_id: timeout_id
        })
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg)
        }
    }
}

export async function closeTaskTimeOut(id: TaskProduction['id']) {
    try {
        const url = `/api/tasks_production_plan/${id}/add-timeout/close`;
        const { data } = await clienteAxios.post<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg)
        }
    }
}