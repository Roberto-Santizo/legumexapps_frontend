import { isAxiosError } from "axios";
import { DraftWeeklyProductionPlanDetailsSchema, DraftWeeklyProductionPlanPackingMaterialRecipeSchema } from "@/utils/draftWeeklyProductionPlanSchemas";
import clienteAxios from "@/config/axios";
import { DraftWeeklyProductionPlan } from "@/components/modals/ModalCreateDraftPlanProduction";
import { WeeklyProductionPlanDraft } from "types/draftWeeklyProductionPlanTypes";
import { LinesHoursPerWeekSchema } from "./LineasAPI";

export async function createDraftWeeklyProductionPlan(FormData: DraftWeeklyProductionPlan) {
    try {
        const url = '/api/weekly-production-plans-drafts';
        const { data } = await clienteAxios.post<number>(url, FormData);

        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function getDraftWeeklyPlanById(id: WeeklyProductionPlanDraft['id']) {
    try {
        const url = `/api/weekly-production-plans-drafts/${id}`;
        const { data } = await clienteAxios(url);

        const result = DraftWeeklyProductionPlanDetailsSchema.safeParse(data);

        if (result.success) {
            return result.data
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function getSummaryDraftLines({ id }: { id: WeeklyProductionPlanDraft['id'] }) {
    try {
        const url = `/api/weekly-production-plans-drafts/${id}/tasks`;
        const { data } = await clienteAxios(url);

        const result = LinesHoursPerWeekSchema.safeParse(data);

        if (result.success) {
            return result.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function getSummaryDraftItems({ id }: { id: WeeklyProductionPlanDraft['id'] }) {
    try {
        const url = `/api/weekly-production-plans-drafts/${id}/packing-material-necessity`;
        const { data } = await clienteAxios(url);

        const result = DraftWeeklyProductionPlanPackingMaterialRecipeSchema.safeParse(data);

        if (result.success) {
            return result.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function uploadTasksProductionDrafts({ file, id }: { file: File[], id: WeeklyProductionPlanDraft['id'] }) {
    try {
        const url = `/api/weekly-production-plans-drafts/${id}/upload-tasks`;
        const formData = new FormData();
        formData.append("file", file[0]);

        const { data } = await clienteAxios.post<string>(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);

        }
    }
}
