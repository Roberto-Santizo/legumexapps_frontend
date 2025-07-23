import { WeeklyProductionPlan } from "types/weeklyProductionPlanTypes";
import { Linea } from "./LineasAPI";
import { EmployeesComodinesSchema, FinishedTaskProductionDetailsSchema, TaskProductionDetailsSchema, TaskProductionInProgressSchema, TaskProductionItemsSchema, TaskProductionReprogramDetailsSchema, TasksByLineSchema, TasksProductionSelectSchema } from "@/utils/taskProductionPlanSchemas";
import { DraftTaskProductionEmployee, TaskProductionChange, TaskProductionNoOperationDate, TaskProductionOperationDate, TaskProductionPlan } from "types/taskProductionPlanTypes";
import { isAxiosError } from "axios";
import clienteAxios from "@/config/axios";
import { DraftUnassignTaskProduction } from "@/components/modals/ModalUnassignNote";
import { DraftPerformance } from "@/components/modals/ModalTomaRendimientoProduccion";
import { DraftCloseTask } from "@/components/modals/ModalCierreTareaProduccion";
import { DraftNote } from "@/components/modals/ModalNotasProblemas";
import { DraftChangeOperationDate } from "@/components/modals/ModalChangeOperationDate";
import { DraftNewTaskProduction } from "@/components/modals/ModalCrearTareaProduccion";

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

export async function getTasksByLineId(plan_id: WeeklyProductionPlan['id'], line_id: Linea['id']) {
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

export async function confirmAssignment({ changes, id }: { changes: TaskProductionChange[], id: TaskProductionPlan['id'] }) {
    try {
        const url = `api/tasks-production/${id}/confirm-assignments`;
        const { data } = await clienteAxios.patch<string>(url, {
            data: changes
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

export async function createNewTaskProduction(FormData: DraftNewTaskProduction) {
    try {
        const url = '/api/tasks-production/new-task';
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

export async function createNewTasksProduction({FormData} : {FormData: DraftNewTaskProduction[]}) {
    try {
        const url = '/api/tasks-production/new-task';
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



