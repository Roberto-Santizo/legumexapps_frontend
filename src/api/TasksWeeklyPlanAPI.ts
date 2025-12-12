import clienteAxios from "@/config/axios";
import { Employee, TaskInsumo } from "@/types/index";
import { EmployeesSchema } from "@/utils/employee-schema";
import { isAxiosError } from "axios";
import { FiltersTareasLoteType } from "@/views/agricola/lote-tasks/Index";
import { TaskWeeklyPlanByDate } from "./WeeklyPlansAPI";
import { WeeklyEmployeeAssignment, WeeklyPlan } from "@/types/planificacionFincasType";
import { TasksWeeklyPlanWithNoOperationDateSchema, TasksWeeklyPlanSchema, TaskWeeklyPlanDetailsSchema, TaskWeeklyPlanSchema, TasksWeeklyPlanForCalendarSchema, WeeklyEmployeeAssignmentsSchema, FincaGroupsSchema } from "@/utils/taskWeeklyPlanSchemas";
import { DraftTaskWeeklyPlan, TaskWeeklyPlan } from "@/types/taskWeeklyPlanTypes";
import { TaskGeneral } from "@/types/taskGeneralType";
import { Lote } from "@/types/lotesType";
import { ApiResponseSchema } from "@/utils/httpRequestsSchemas";
import { DraftFincaGroup } from "@/components/modals/ModalCreateFincaGroup";
import { Finca } from "./FincasAPI";

export async function getTasks({ lote, weekly_plan_id, filters }: { lote: TaskWeeklyPlan['lote'], weekly_plan_id: TaskWeeklyPlan['weekly_plan_id'], filters: FiltersTareasLoteType }) {
    try {
        const url = `/api/tasks-lotes?lote=${lote}&weekly_plan=${weekly_plan_id}&name=${filters.name}&code=${filters.code}&task_type=${filters.task_type}`;
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
        const url = `/api/tasks-lotes/close-assignment/${task_id}?dron=true`
        const { data } = await clienteAxios.post<string>(url);

        const response = ApiResponseSchema.safeParse(data);

        if (response.success) {
            return response.data.message;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Error no controlado");
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

export async function closeAssigment(task_id: TaskWeeklyPlan['id']) {
    try {
        const url = `/api/tasks-lotes/close-assignment/${task_id}`
        const { data } = await clienteAxios.post<string>(url);
        const response = ApiResponseSchema.safeParse(data);
        if (response.success) {
            return response.data.message;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Error no controlado");
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
        throw error;
    }
}

export async function uploadAssignments({ file, id }: { file: File, id: WeeklyPlan['id'], }) {
    try {
        const url = `/api/weekly-assignment-employee/upload/${id}`;
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await clienteAxios.post(url, formData);
        const result = ApiResponseSchema.safeParse(data);
        if (result.success) {
            return result.data.message;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Error no controlado");
    }
}

export async function getPlanificationEmployee({ id, loteId, filterEmployee }: { id: WeeklyPlan['id'], loteId: Lote['id'], filterEmployee: string }) {
    try {
        const url = `/api/weekly-assignment-employee/${id}?lote=${loteId}&name=${filterEmployee}`;
        const { data } = await clienteAxios(url);
        const response = WeeklyEmployeeAssignmentsSchema.safeParse(data);

        if (response.success) {
            return response.data.data;
        }
    } catch (error) {
        throw error;
    }
}

export async function deleteEmployeeAssignment({ id }: { id: WeeklyEmployeeAssignment['id'] }) {
    try {
        const url = `/api/weekly-assignment-employee/${id}`;
        const { data } = await clienteAxios.delete(url);
        const response = ApiResponseSchema.safeParse(data);

        if (response.success) {
            return response.data.message;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Error no controlado");
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

export async function createFincaGroup(formData: DraftFincaGroup) {
    try {
        const url = `/api/finca-groups`;
        const { data } = await clienteAxios.post(url, formData);
        const result = ApiResponseSchema.safeParse(data);
        if (result.success) {
            return result.data.message;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Error no controlado");
    }
}

export async function getFincaGroups(fincaId: Finca['id']) {
    try {
        const url = `/api/finca-groups?fincaId=${fincaId}`;
        const { data } = await clienteAxios(url);
        const response = FincaGroupsSchema.safeParse(data);

        if (response.success) {
            return response.data.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }

        throw new Error("Error no controlado");
    }
}

export async function assignEmployeesToGroup({ ids, groupId }: { ids: { assign_id: number }[], groupId: string }) {
    try {
        const url = `/api/weekly-assignment-employee/group/${groupId}`;
        const { data } = await clienteAxios.post(url, {
            data: ids
        });
        const response = ApiResponseSchema.safeParse(data);

        if (response.success) {
            return response.data.message;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }

        throw new Error("Error no controlado");
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

export async function changeOperationDate({ date, ids, group_id }: { date: string, ids: string[], group_id: string }) {
    try {
        const url = '/api/tasks-lotes/change-operation-date/update';
        const { data } = await clienteAxios.patch<string>(url, {
            date,
            group_id,
            tasks: ids
        });

        const response = ApiResponseSchema.safeParse(data);

        if (response.success) {
            return response.data.message;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Error no controlado");
    }
}