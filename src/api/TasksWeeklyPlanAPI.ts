import clienteAxios from "@/config/axios";
import { Employee, TaskInsumo } from "@/types";
import { EmployeesSchema } from "@/utils/employee-schema";
import { isAxiosError } from "axios";
import { FiltersTareasLoteType } from "@/views/agricola/lote-tasks/Index";
import { TaskWeeklyPlanByDate } from "./WeeklyPlansAPI";
import { WeeklyPlan } from "types/planificacionFincasType";
import { TasksWeeklyPlanWithNoOperationDateSchema, TasksWeeklyPlanSchema, TaskWeeklyPlanDetailsSchema, TaskWeeklyPlanSchema, TasksWeeklyPlanForCalendarSchema } from "@/utils/taskWeeklyPlanSchemas";
import { DraftTaskWeeklyPlan, TaskWeeklyPlan } from "types/taskWeeklyPlanTypes";
import { TaskGeneral } from "types/taskGeneralType";
import { Lote } from "types/lotesType";

export async function getTasks({ cdp, weekly_plan_id, filters }: { cdp: TaskWeeklyPlan['lote_plantation_control_id'], weekly_plan_id: TaskWeeklyPlan['weekly_plan_id'], filters: FiltersTareasLoteType }) {
    try {
        const url = `/api/tasks-lotes?cdp=${cdp}&weekly_plan=${weekly_plan_id}&name=${filters.name}&code=${filters.code}&task_type=${filters.task_type}`;
        const { data } = await clienteAxios(url);
        const result = TasksWeeklyPlanSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Error información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function closeTask(id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/close/${id}`;
        const { data } = await clienteAxios.patch<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function cleanTask(id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/erase/${id}`;
        const { data } = await clienteAxios.delete<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function createPartialClosure(id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/partial-close/close/${id}`;
        const { data } = await clienteAxios.patch<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function closePartialClosure(id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/partial-close/open/${id}`;
        const { data } = await clienteAxios.patch<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function closeAssigmentDron(task_id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/close-assignment/${task_id}`
        const { data } = await clienteAxios.post<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function deteleteTask(id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/${id}`;
        const { data } = await clienteAxios.delete<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function getTaskById(id: TaskWeeklyPlan['id']): Promise<TaskWeeklyPlan> {
    try {
        const url = `/api/tasks-lotes/${id}`;
        const { data } = await clienteAxios(url);
        const result = TaskWeeklyPlanSchema.safeParse(data.data);
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

export async function getTaskDetailsById(id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/${id}/details`;
        const { data } = await clienteAxios(url);
        const result = TaskWeeklyPlanDetailsSchema.safeParse(data.data);
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

export async function closeAssigment({ Employees, task_id }: { Employees: Employee[], task_id: TaskWeeklyPlan['id'] }) {
    try {
        const url = `/api/tasks-lotes/close-assignment/${task_id}`
        const { data } = await clienteAxios.post<string>(url, { data: Employees });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function getTask(id: TaskWeeklyPlan['id']): Promise<TaskWeeklyPlan> {
    try {
        const url = `/api/tasks-lotes/${id}`;
        const { data } = await clienteAxios(url);
        const result = TaskWeeklyPlanSchema.safeParse(data.data);
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

export async function getEmployees(id: TaskWeeklyPlan['finca_id']): Promise<Employee[]> {
    try {
        const url = `/api/employees/${id}`;
        const { data } = await clienteAxios(url);
        const result = EmployeesSchema.safeParse(data);
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

export async function createTaskWeeklyPlan({ FormData }: { FormData: DraftTaskWeeklyPlan }) {
    try {
        const url = '/api/tasks-lotes';
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

export async function registerUsedInsumos(data: TaskInsumo[]) {
    try {
        const url = '/api/tasks-lotes/register-insumos';
        await clienteAxios.post(url, {
            insumos: data
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function editTask({ FormData, id }: { FormData: DraftTaskWeeklyPlan, id: TaskWeeklyPlan['id'] }) {
    try {
        const url = `/api/tasks-lotes/${id}`
        const { data } = await clienteAxios.put<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function getTasksNoPlanificationDate({ id, loteId, taskId }: { id: WeeklyPlan['id'], loteId: Lote['id'], taskId: TaskGeneral['id'] }) {
    try {
        const url = `/api/plans/tasks-no-planification-date/${id}?lote=${loteId}&task=${taskId}`;
        const { data } = await clienteAxios(url);
        const result = TasksWeeklyPlanWithNoOperationDateSchema.safeParse(data);
        if (result.success) {
            return result.data.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTasksForCalendar(id: WeeklyPlan['id']) {
    try {
        const url = `/api/plans/tasks-for-calendar/${id}`;
        const { data } = await clienteAxios(url);
        const result = TasksWeeklyPlanForCalendarSchema.safeParse(data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function changePreparedInsumosState(id: TaskWeeklyPlanByDate['id']) {
    try {
        const url = `/api/tasks-lotes/prepared-insumos/${id}`;
        const { data } = await clienteAxios.patch<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function changeOperationDate({ date, ids }: { date: string, ids: string[] }) {
    try {
        const url = '/api/tasks-lotes/change-operation-date/update';
        const { data } = await clienteAxios.patch<string>(url, {
            date: date,
            tasks: ids
        });
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else if (error.response?.data.msg) {
                throw new Error(error.response?.data.msg);
            }
        }
    }
}