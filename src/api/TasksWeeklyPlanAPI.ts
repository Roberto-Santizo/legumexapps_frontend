import clienteAxios from "@/config/axios";
import { DraftCreateTaskWeeklyPlan, Employee, TaskInsumo, TaskWeeklyPlan, TaskWeeklyPlanDetails } from "@/types";
import { EmployeesSchema } from "@/utils/employee-schema";
import { TasksWeeklyPlanSchema, TaskWeeklyPlanDetailsSchema, TaskWeeklyPlanSchema } from "@/utils/taskWeeklyPlan-schema";
import { isAxiosError } from "axios";
import { DraftSelectedInsumo } from "views/agricola/planes-semanales/CreateTareaLote";
import { DraftTaskWeeklyPlan } from "views/agricola/tareas-lote/EditarTareaLote";
import { z } from "zod";

export async function getTasks(id: TaskWeeklyPlan['lote_plantation_control_id'], weekly_plan_id: TaskWeeklyPlan['weekly_plan_id']) {
    try {
        const url = `/api/tasks-lotes`;
        const { data } = await clienteAxios(url, {
            params: { id: id, weekly_plan_id: weekly_plan_id }
        });
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
        await clienteAxios.patch(url);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function cleanTask(id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/erase/${id}`;
        await clienteAxios.delete(url);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createPartialClosure(id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/partial-close/close/${id}`;
        await clienteAxios.patch(url);
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export async function closePartialClosure(id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/partial-close/open/${id}`;
        await clienteAxios.patch(url);
    } catch (error: any) {
        console.log(error);
        throw error;

    }
}

export async function closeAssigmentDron(task_id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/close-assignment/${task_id}`
        await clienteAxios.post(url);
    } catch (error) {
        throw error;
    }
}

export async function deteleteTask(id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/${id}`;
        await clienteAxios.delete(url);
    } catch (error) {
        console.log(error);
        throw new Error("Hubo un problema para cerrar la tarea");
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
        console.log(result);
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

export async function closeAssigment(Employees: Employee[], task_id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/close-assignment/${task_id}`
        await clienteAxios.post(url, {
            data: Employees
        });
    } catch (error) {
        console.log(error);
        throw error;
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

export async function createTaskWeeklyPlan(data: DraftCreateTaskWeeklyPlan, insumos: DraftSelectedInsumo[]) {
    try {
        const url = '/api/tasks-lotes';
        await clienteAxios.post(url, {
            data,
            insumos: insumos
        });
    } catch (error) {
        throw error;
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

export async function editTask({FormData, id} : {FormData: DraftTaskWeeklyPlan, id: TaskWeeklyPlan['id']}) {
    try {
        const url = `/api/tasks-lotes/${id}`
        const { data } = await clienteAxios.put<string>(url, FormData);
        return data;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.msg);
        }
    }
}