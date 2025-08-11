import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { DraftLinea } from "@/views/produccion/lines/Create";
import { WeeklyProductionPlan } from "types/weeklyProductionPlanTypes";
import { LineDetailSchema, LinePerformanceByDaySchema, LinesHoursPerWeekSchema, LinesPaginatedSchema, LinesSelectSchema } from "@/utils/lineSchemas";
import { Line } from "recharts";
import { LinePerformanceByDay } from "types/linesTypes";
import { StockKeepingUnit } from "types/stockKeepingUnitTypes";


export async function getLineas({ page, paginated }: { page: number, paginated: string }) {
    try {
        const url = `/api/lines?paginated=${paginated}&page=${page}`;
        const { data } = await clienteAxios(url);
        const result = LinesPaginatedSchema.safeParse(data);
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

export async function getLinesBySkuId(id: StockKeepingUnit['id']) {
    try {
        const url = `/api/lines-by-sku/${id}`;
        const { data } = await clienteAxios(url);
        const result = LinesSelectSchema.safeParse(data);
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


export async function getLineaById(id: Line['id'])  {
    try {
        const url = `/api/lines/${id}`;
        const { data } = await clienteAxios(url);
        const result = LineDetailSchema.safeParse(data);
        if (result.success) {
            return result.data.data;
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}



export async function createLinea(FormData: DraftLinea) {
    try {
        const url = '/api/lines';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function updateLinea(FormData: DraftLinea, id: Line['id']) {
    try {
        const url = `/api/lines/${id}`;
        const { data } = await clienteAxios.put<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function updatePositionsLine({ file, id }: { file: File[], id: Line['id'] }) {
    try {
        const url = `/api/lines/update-positions/${id}`;
        const formData = new FormData();
        formData.append("file", file[0]);

        const { data } = await clienteAxios.post<string>(url, formData);
        return data;
    } catch (error: any) {
        return error.response.data.message;
    }
}

export async function getLinePerformanceByDay(line_id: Line['id'], date: string): Promise<LinePerformanceByDay> {
    try {
        const url = `/api/lines/performances-per-day/${line_id}?date=${date}`;
        const { data } = await clienteAxios(url);
        const result = LinePerformanceByDaySchema.safeParse(data);
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

export async function getLineHoursPerWeek({ weeklyplanId }: { weeklyplanId: WeeklyProductionPlan['id'] }) {
    try {
        const url = `/api/lines/hours-per-week/${weeklyplanId}`;
        const { data } = await clienteAxios(url);

        const result = LinesHoursPerWeekSchema.safeParse(data);

        if (result.success) {
            return result.data
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}