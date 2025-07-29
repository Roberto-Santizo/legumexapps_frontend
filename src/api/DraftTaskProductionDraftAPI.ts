import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { NewTaskProductionDraft } from "@/components/modals/ModalAddNewDraftProductionTask";
import { WeeklyProductionPlanDraft } from "types/draftWeeklyProductionPlanTypes";
import { TaskProductionPlanDraft } from "types/draftTaskProductionTypes";
import { DraftTaskProductionPlanEditDetailsSchema } from "@/utils/draftTaskProductionPlanSchemas";

export async function createNewTaskProductionDraft({ formData, id }: { formData: NewTaskProductionDraft, id: WeeklyProductionPlanDraft['id'] }) {
    try {
        const url = `/api/tasks-production-drafts/${id}`;

        const { data } = await clienteAxios.post(url, formData);

        return data;

    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function deleteTaskProductionDraft({ id }: { id: TaskProductionPlanDraft['id'] }) {
    try {
        const url = `/api/tasks-production-drafts/${id}`;

        const { data } = await clienteAxios.delete(url);

        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function getTaskProductionDraftEditDetails({ id }: { id: TaskProductionPlanDraft['id'] }) {
    try {
        const url = `/api/tasks-production-drafts/${id}/edit-details`;

        const { data } = await clienteAxios(url);

        const result = DraftTaskProductionPlanEditDetailsSchema.safeParse(data);

        if (result.success) {
            return result.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function editTaskProductionDraft({ formData, id }: { formData: NewTaskProductionDraft, id: TaskProductionPlanDraft['id'] }) {
    try {
        const url = `/api/tasks-production-drafts/${id}`;

        const { data } = await clienteAxios.put(url, formData);

        return data;

    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}