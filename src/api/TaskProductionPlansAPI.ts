import { WeeklyProductionPlan } from "@/types/weeklyProductionPlanTypes";
import { EmployeesComodinesSchema, FinishedTaskProductionDetailsSchema, TaskProductionDetailsSchema, TaskProductionEditiDetailsSchema, TaskProductionInProgressSchema, TaskProductionItemsSchema, TaskProductionReprogramDetailsSchema, TasksByLineSchema, TasksProductionSelectSchema } from "@/utils/taskProductionPlanSchemas";
import { DraftTaskProductionEmployee, TaskProductionChange, TaskProductionNoOperationDate, TaskProductionOperationDate, TaskProductionPlan } from "@/types/taskProductionPlanTypes";
import { isAxiosError } from "axios";
import { DraftUnassignTaskProduction } from "@/components/modals/ModalUnassignNote";
import { DraftPerformance } from "@/components/modals/ModalTomaRendimientoProduccion";
import { DraftCloseTask } from "@/components/modals/ModalCierreTareaProduccion";
import { DraftNote } from "@/components/modals/ModalNotasProblemas";
import { DraftChangeOperationDate } from "@/components/modals/ModalChangeOperationDate";
import { DraftNewTaskProduction } from "@/components/modals/ModalCrearTareaProduccion";
import clienteAxios from "@/config/axios";
import { Line } from "recharts";

export async function getComodines() {
    try {
        const url = '/api/employees-comodines';
        const { data } = await clienteAxios(url);
        const result = EmployeesComodinesSchema.safeParse(data);
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

export async function getTasksByLineId(plan_id: WeeklyProductionPlan['id'], line_id: Line['id']) {
    try {
        const url = `/api/weekly-production-plans/details/${plan_id}/${line_id}`;
        const { data } = await clienteAxios(url);
        const result = TasksByLineSchema.safeParse(data);
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

export async function getTaskProductionDetails(id: TaskProductionPlan['id']) {
    try {
        const url = `/api/tasks-production/${id}`;
        const { data } = await clienteAxios(url);
        const result = TaskProductionDetailsSchema.safeParse(data.data);
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

export async function confirmAssignment({ changes, id, previousConfig }: { changes: TaskProductionChange[], id: TaskProductionPlan['id'], previousConfig: boolean }) {
    try {
        const url = `api/tasks-production/${id}/confirm-assignments`;
        const { data } = await clienteAxios.patch<string>(url, {
            data: changes,
            previous_config: previousConfig
        });

        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else if (error.response?.data.msg) {
                throw new Error(error.response.data.msg);
            }
        }
    }
}

export async function createTaskProductionEmployees({ id, FormData }: { id: TaskProductionPlan['id'], FormData: DraftTaskProductionEmployee[] }) {
    try {
        const url = `/api/tasks-production/create-assignees/${id}`;
        const { data } = await clienteAxios.post<string>(url, {
            data: FormData
        });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function startTaskProductionPlan(id: TaskProductionPlan['id']) {
    try {
        const url = `/api/tasks-production/${id}/start`;
        const { data } = await clienteAxios.patch<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else if (error.response?.data.msg) {
                throw new Error(error.response.data.msg);
            }
        }
    }
}

export async function getActiveTaskProductionEmployees(id: TaskProductionPlan['id']) {
    try {
        const url = `/api/tasks-production/active-employees/${id}`;
        const { data } = await clienteAxios(url);
        const result = EmployeesComodinesSchema.safeParse(data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createTaskProductionUnassignment({ id, FormData }: { id: string, FormData: DraftUnassignTaskProduction }) {
    try {
        const url = `/api/tasks-production/${id}/unassign`;
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function createTaskProductionPerformance({ id, FormData }: { id: TaskProductionPlan['id'], FormData: DraftPerformance }) {
    try {
        const url = `/api/tasks-production/${id}/performance`;
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function closeTaskProduction({ id, FormData }: { id: TaskProductionPlan['id'], FormData: DraftCloseTask }) {
    try {
        const url = `/api/tasks-production/${id}/end`;
        const { data } = await clienteAxios.patch<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function createTaskProductionNote(FormData: DraftNote) {
    try {
        const url = '/api/notes';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.message);
        }
    }
}

export async function getTaskProductionInProgressDetails(id: TaskProductionPlan['id']) {
    try {
        const url = `/api/tasks-production/details/${id}`;
        const { data } = await clienteAxios(url);
        const result = TaskProductionInProgressSchema.safeParse(data);
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

export async function getFinishedTaskProductionDetails(id: TaskProductionPlan['id']) {
    try {
        const url = `/api/tasks-production/finished/details/${id}`;
        const { data } = await clienteAxios(url);
        const result = FinishedTaskProductionDetailsSchema.safeParse(data);
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

export async function assignOperationDate({ id, date }: { id: TaskProductionNoOperationDate['id'], date: string }) {
    try {
        const url = `/api/tasks-production/assign-operation-date/${id}`;
        const { data } = await clienteAxios.patch<string>(url, {
            date
        });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg)
        }
    }
}

export async function updateTaskProductionOperationDate({ id, FormData }: { id: TaskProductionOperationDate['id'], FormData: DraftChangeOperationDate }) {
    try {
        const url = `/api/tasks-production/change-operation-date/${id}`;
        const { data } = await clienteAxios.patch<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg)
        }
    }
}


export async function createNewTaskProduction({ FormData, id }: { FormData: DraftNewTaskProduction, id: WeeklyProductionPlan['id'] }) {
    try {
        const url = `/api/tasks-production/new-task/${id}`;
        const { data } = await clienteAxios.post<string>(url, {
            data: [FormData]
        });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg || "Error al crear nueva tarea")
        }
    }
}

export async function createNewTasksProduction({ FormData, id }: { FormData: DraftNewTaskProduction[], id: WeeklyProductionPlan['id'] }) {
    try {
        const url = `/api/tasks-production/new-task/${id}`;
        const { data } = await clienteAxios.post<string>(url, {
            data: FormData
        });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg)
        }
    }
}

export async function getTaskReturnPackingMaterialDetails({ id }: { id: TaskProductionPlan['id'] }) {
    try {
        const url = `/api/tasks-production/devolution-details/${id}`;
        const { data } = await clienteAxios(url);
        const result = TaskProductionItemsSchema.safeParse(data);

        if (result.success) {
            return result.data
        } else {
            throw new Error("Información valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTasksProduction() {
    try {
        const url = '/api/tasks-production';
        const { data } = await clienteAxios(url);
        const result = TasksProductionSelectSchema.safeParse(data);
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

export async function getTaskProductionReprogramDetails({ taskId }: { taskId: TaskProductionPlan['id'] }) {
    try {
        const url = `/api/tasks-production/reprogram-details/${taskId}`;
        const { data } = await clienteAxios(url);

        const result = TaskProductionReprogramDetailsSchema.safeParse(data);

        if (result.success) {
            return result.data
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteTaskProduction({ taskId }: { taskId: TaskProductionPlan['id'] }) {
    try {
        const url = `/api/tasks-production/${taskId}`;

        const { data } = await clienteAxios.delete(url);

        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function UnAssignTaskProduction({ taskId }: { taskId: TaskProductionPlan['id'] }) {
    try {
        const url = `/api/tasks-production/${taskId}/unassign`;

        const { data } = await clienteAxios.patch(url);

        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function deleteTaskProductionAssignments({ taskId }: { taskId: TaskProductionPlan['id'] }) {
    try {
        const url = `/api/tasks-production/${taskId}/delete-assignments`;

        const { data } = await clienteAxios.patch(url);

        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function getEditDetailsProductionTask({ taskId }: { taskId: TaskProductionPlan['id'] }) {
    try {
        const url = `/api/tasks-production/edit-details/${taskId}`;

        const { data } = await clienteAxios(url);

        const result = TaskProductionEditiDetailsSchema.safeParse(data);

        if (result) {
            return result.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function editProductionTask({ taskId, formData }: { taskId: TaskProductionPlan['id'], formData: DraftNewTaskProduction }) {
    try {
        const url = `/api/tasks-production/${taskId}`;

        const { data } = await clienteAxios.put(url, formData);

        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function updateTaskProductionStatus({ taskId, status }: { taskId: TaskProductionPlan['id'], status: number }) {
    try {
        const url = `/api/tasks-production/${taskId}/update-status`;

        const { data } = await clienteAxios.patch<string>(url, {
            status
        });

        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}



