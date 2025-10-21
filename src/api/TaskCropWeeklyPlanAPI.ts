import clienteAxios from "@/config/axios";
import { EmployeesTaskCropPlanSchema, TaskCropWeeklyPlanDetailSchema, TaskCropWeeklyPlanSchema, TasksCropIncompleteSchema, TasksCropWeeklyPlanSchema } from "@/utils/taskCropWeeklyPlan-schema";
import { isAxiosError } from "axios";
import { TaskWeeklyPlan } from "@/types/taskWeeklyPlanTypes";
import { DraftTaskCropWeeklyPlan } from "@/views/agricola/harvest-tasks/Create";
import { Employee, EmployeeCrop, EmployeesCrop, TaskCropIncomplete, TaskCropWeeklyPlan, TaskCropWeeklyPlanDetail, TasksCropWeeklyPlan } from "@/types/index";

export async function getTasksCrop(lote_plantation_control_id: TaskWeeklyPlan['lote'], weekly_plan_id: TaskWeeklyPlan['weekly_plan_id']): Promise<TasksCropWeeklyPlan> {
    try {
        const url = `/api/tasks-crops-lotes`;
        const { data } = await clienteAxios(url, {
            params: { lote_plantation_control_id, weekly_plan_id }
        });
        const result = TasksCropWeeklyPlanSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTaskCrop(id: TaskCropWeeklyPlan['id']): Promise<TaskCropWeeklyPlan> {
    try {
        const url = `/api/tasks-crops-lotes/${id}`;
        const { data } = await clienteAxios(url);
        const result = TaskCropWeeklyPlanSchema.safeParse(data.data);
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

export async function closeCropAssigment(Employees: Employee[], task_crop_id: TaskCropWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-crops-lotes/close-assignment/${task_crop_id}`
        await clienteAxios.post(url, {
            data: Employees
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getCropEmployees(id: TaskCropWeeklyPlan['finca_id']): Promise<EmployeesCrop> {
    try {
        const url = `/api/tasks-crops-lotes/employees/${id}`;
        const { data } = await clienteAxios(url);

        const result = EmployeesTaskCropPlanSchema.safeParse(data);

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

export async function closeDailyAssignment(id: TaskCropWeeklyPlan['id'], data: EmployeeCrop[], plants: number) {
    try {
        const totalLbs = data.reduce((accumulator, currentValue) => { return accumulator + (currentValue.lbs || 0) }, 0);
        const url = `/api/tasks-crops-lotes/close-daily-assigment/${id}`
        await clienteAxios.post(url, {
            task_crop_id: id,
            lbs_finca: totalLbs,
            plants: plants,
            assigments: data
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createTaskCropWeeklyPlan(FormData: DraftTaskCropWeeklyPlan) {
    try {
        const url = '/api/tasks-crops-lotes';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        };
    }
}

export async function closeWeekAssignment(id: TaskCropWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-crops-lotes/${id}`;
        await clienteAxios.patch(url);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getTaskCropDetails(id: TaskCropWeeklyPlan['id']): Promise<TaskCropWeeklyPlanDetail> {
    try {
        const url = `/api/tasks-crops-lotes/details/${id}`;
        const { data } = await clienteAxios(url);
        const result = TaskCropWeeklyPlanDetailSchema.safeParse(data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Información no valida');
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getCropDailyEmployees(id: TaskCropWeeklyPlan['finca_id']) {
    try {
        const url = `/api/tasks-crops-lotes/daily-employees/${id}`;
        const { data } = await clienteAxios(url);

        const result = EmployeesTaskCropPlanSchema.safeParse(data);

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

export async function getIncompleteAssigments(id: TaskCropWeeklyPlan['id']): Promise<TaskCropIncomplete[]> {
    try {
        const url = `/api/tasks-crops-lotes/incomplete-assigments/${id}`;
        const { data } = await clienteAxios(url);
        const result = TasksCropIncompleteSchema.safeParse(data);
        if (result.success) {
            return result.data.data;
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function completeAssigments(data: TaskCropIncomplete[]) {
    try {
        const url = '/api/tasks-crops-lotes/register-daily-assigment'
        await clienteAxios.post(url, data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}