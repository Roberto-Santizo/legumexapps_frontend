import clienteAxios from "@/config/axios";
import { Employee, Tarea, TaskInsumo, TaskWeeklyPlan, TaskWeeklyPlanDetails } from "@/types";
import { EmployeesSchema } from "@/utils/employee-schema";
import { TasksWeeklyPlanSchema, TaskWeeklyPlanDetailsSchema, TaskWeeklyPlanSchema } from "@/utils/taskWeeklyPlan-schema";
import { isAxiosError } from "axios";
import { DraftNewTaskWeeklyPlan } from "views/agricola/planes-semanales/CreateTareaLote";
import { DraftTaskWeeklyPlan } from "views/agricola/tareas-lote/EditarTareaLote";
import { z } from "zod";
import { Lote } from "./LotesAPI";
import { FiltersTareasLoteType } from "@/views/agricola/tareas-lote/IndexTareasLote";
import { TaskWeeklyPlanByDate, WeeklyPlan } from "./WeeklyPlansAPI";

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

export async function getTaskDetailsById(id: TaskWeeklyPlan['id']): Promise<TaskWeeklyPlanDetails> {
    try {
        const url = `/api/tasks-lotes/${id}/details`;
        const { data } = await clienteAxios(url);
        const result = TaskWeeklyPlanDetailsSchema.safeParse(data.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error("Failed to fetch task details");
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

export const EditTaskWeeklyPlanSchema = z.object({
    budget: z.number(),
    end_date: z.string().nullable(),
    end_time: z.string().nullable(),
    start_date: z.string().nullable(),
    start_time: z.string().nullable(),
    weekly_plan_id: z.string(),
    slots: z.number(),
    hours: z.number()
});

export type EditTaskWeeklyPlan = z.infer<typeof EditTaskWeeklyPlanSchema>

export async function getEditTask(id: TaskWeeklyPlan['id']): Promise<EditTaskWeeklyPlan> {
    try {
        const url = `/api/tasks-lotes/edit/${id}`;
        const { data } = await clienteAxios(url);
        const result = EditTaskWeeklyPlanSchema.safeParse(data.data);
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
        const url = `/api/employees`;
        const { data } = await clienteAxios(url, {
            params: { id }
        });
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

export async function createTaskWeeklyPlan({ FormData }: { FormData: DraftNewTaskWeeklyPlan }) {
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

export const TaskWeeklyPlanForCalendarSchema = z.object({
    id: z.string(),
    task: z.string(),
    finca: z.string(),
    lote: z.string(),
    bg_color: z.string()
});

export const TasksWeeklyPlanForCalendarSchema = z.object({
    data: z.array(TaskWeeklyPlanForCalendarSchema)
});

export type TaskWeeklyPlanForCalendar = z.infer<typeof TaskWeeklyPlanForCalendarSchema>;

export async function getTasksNoPlanificationDate({ id, loteId, taskId }: { id: WeeklyPlan['id'], loteId: Lote['id'], taskId: Tarea['id'] }): Promise<TaskWeeklyPlanForCalendar[]> {
    try {
        const url = `/api/plans/tasks-no-planification-date/${id}?lote=${loteId}&task=${taskId}`;
        const { data } = await clienteAxios(url);
        const result = TasksWeeklyPlanForCalendarSchema.safeParse(data);
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

export const TaskForCalendarSchema = z.object({
    id: z.string(),
    title: z.string(),
    start: z.string(),
    end: z.string(),
    backgroundColor: z.string(),
    editable: z.boolean(),
    task: z.string(),
    finca: z.string(),
    lote: z.string(),
    cdp: z.string(),
});

export const TasksForCalendarSchema = z.object({
    data: z.array(TaskForCalendarSchema),
    initial_date: z.string(),
    tasks_without_operation_date: z.number(),
    tasks_with_operation_date: z.number(),
});

export type TaskForCalendarInfo = z.infer<typeof TasksForCalendarSchema>;
export type TaskForCalendar = z.infer<typeof TaskForCalendarSchema>;


export async function getTasksForCalendar(id: WeeklyPlan['id']) {
    try {
        const url = `/api/plans/tasks-for-calendar/${id}`;
        const { data } = await clienteAxios(url);
        const result = TasksForCalendarSchema.safeParse(data);
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