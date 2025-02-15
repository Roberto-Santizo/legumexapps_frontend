import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { DraftCreateTaskWeeklyPlan, DraftTaskWeeklyPlan, Employee, TaskInsumo, TasksWeeklyPlan, TaskWeeklyPlan, TaskWeeklyPlanDetails } from "../types";
import { TasksWeeklyPlanSchema, TaskWeeklyPlanDetailsSchema, TaskWeeklyPlanSchema } from "../utils/taskWeeklyPlan-schema";
import { EmployeesSchema } from "../utils/employee-schema";

export type TaskWeeklyPlanSliceType = {

    tasksWeeklyPlan: TasksWeeklyPlan;
    loadingReloadTasks: boolean;
    OpenModalInsumos: boolean;
    idTask: string

    getTasks: (id: TaskWeeklyPlan['lote_plantation_control_id'], weekly_plan_id: TaskWeeklyPlan['weekly_plan_id']) => Promise<void>
    getTask: (id: TaskWeeklyPlan['id']) => Promise<TaskWeeklyPlan>
    createTaskWeeklyPlan: (data: DraftCreateTaskWeeklyPlan) => Promise<void>
    getEmployees: (id: TaskWeeklyPlan['finca_id']) => Promise<Employee[]>
    closeAssigment: (Employees: Employee[], task_id: TaskWeeklyPlan['id']) => Promise<void>
    closeAssigmentDron: (task_id: TaskWeeklyPlan['id']) => Promise<void>
    createPartialClosure: (id: TaskWeeklyPlan['id']) => Promise<void>
    closePartialClosure: (id: TaskWeeklyPlan['id']) => Promise<void>
    getTaskDetailsById: (id: TaskWeeklyPlan['id']) => Promise<TaskWeeklyPlanDetails>
    closeTask: (id: TaskWeeklyPlan['id']) => Promise<void>
    deteleteTask: (id: TaskWeeklyPlan['id']) => Promise<void>
    cleanTask: (id: TaskWeeklyPlan['id']) => Promise<void>
    editTask: (data: DraftTaskWeeklyPlan, id: TaskWeeklyPlan['id']) => Promise<void>
    registerUsedInsumos: (data : TaskInsumo[]) => Promise<void>
    openModalAction: (id: TaskWeeklyPlan['id']) => void
    closeModalAction: () => void
}


export const createTaskWeeklyPlanSlice: StateCreator<TaskWeeklyPlanSliceType> = (set) => ({
    OpenModalInsumos: false,
    tasksWeeklyPlan: {} as TasksWeeklyPlan,
    loadingReloadTasks: false,
    idTask: '',
    getTasks: async (id, plan_id) => {
        set({loadingReloadTasks: true});
        try {
            const url = `/api/tasks-lotes`;
            const { data } = await clienteAxios(url, {
                params: { id: id, weekly_plan_id: plan_id }
            });
            const result = TasksWeeklyPlanSchema.safeParse(data);
            if (result.success) {
                set({tasksWeeklyPlan: result.data});
            } else {
                throw new Error("Error información no válida");
            }
        } catch (error) {
            throw error;
        } finally {
            set({loadingReloadTasks: false})
        }
    },

    getTask: async (id) => {
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
            throw error;
        }
    },

    createTaskWeeklyPlan: async (data) => {
        try {
            const url = '/api/tasks-lotes';
            await clienteAxios.post(url,data);
        } catch (error) {
            throw error;
        }
    },
    createPartialClosure: async (id) => {
        try {
            const url = `/api/tasks-lotes/partial-close/close/${id}`;
            await clienteAxios.patch(url);
        } catch (error: any) {
            throw error;

        }
    },

    closePartialClosure: async (id) => {
        try {
            const url = `/api/tasks-lotes/partial-close/open/${id}`;
            await clienteAxios.patch(url);
        } catch (error: any) {
            throw error;

        }
    },
    closeAssigment: async (Employees, task_id) => {
        try {
            const url = `/api/tasks-lotes/close-assignment/${task_id}`
            await clienteAxios.post(url, {
                data: Employees
            });
        } catch (error) {
            throw error;
        }
    },
    closeAssigmentDron: async (id) => {
        try {
             const url = `/api/tasks-lotes/close-assignment/${id}`
            await clienteAxios.post(url);
        } catch (error) {
            throw error;
        }
    },
    closeTask: async (id) => {
        try {
            const url = `/api/tasks-lotes/close/${id}`;
            await clienteAxios.patch(url);
        } catch (error) {
            throw error;
        }
    },
   
    deteleteTask: async (id) => {
        try {
            const url = `/api/tasks-lotes/${id}`;
            await clienteAxios.delete(url);
        } catch (error) {
            throw new Error("Hubo un problema para cerrar la tarea");
        }
    },
    cleanTask: async (id) => {
        try {
            const url = `/api/tasks-lotes/erase/${id}`;
            await clienteAxios.delete(url);
        } catch (error) {
            throw error;
        }
    },
    editTask: async (data, id) => {
        try {
            const url = `/api/tasks-lotes/${id}`
            await clienteAxios.put(url, data);
        } catch (error) {
            throw error;
        }
    },

    getEmployees: async (id) => {
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
            throw error;
        }
    },

    getTaskDetailsById: async (id) => {
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
            throw error;
        }
    },

    registerUsedInsumos: async (data) => {
        try {
            const url = '/api/tasks-lotes/register-insumos';
            await clienteAxios.post(url,{
                insumos: data
            });
        } catch (error) {
            throw error;
        }
    },

    openModalAction: (id) =>{
        set({OpenModalInsumos: true, idTask: id});
    },

    closeModalAction: () => {
        set({OpenModalInsumos: false,idTask: ''});
    }

})