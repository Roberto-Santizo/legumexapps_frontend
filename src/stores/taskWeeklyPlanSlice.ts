import { StateCreator } from "zustand"
import clienteAxios from "../config/axios"
import { DraftTaskWeeklyPlan, Employee, TasksWeeklyPlan, TaskWeeklyPlan, TaskWeeklyPlanDetails } from "../types"
import { TasksWeeklyPlanSchema, TaskWeeklyPlanDetailsSchema, TaskWeeklyPlanSchema } from "../utils/taskWeeklyPlan-schema";
import { EmployeesSchema } from "../utils/employee-schema";

export type TaskWeeklyPlanSliceType = {
    tasks: TasksWeeklyPlan;
    task: TaskWeeklyPlan;
    employees: Employee[];

    loadingFetchTasks: boolean;
    loadingPartialClosure: boolean;
    loadingUpdateTask: boolean;
    loadingGetTask: boolean;
    loadingGetEmployees: boolean;
    loadingCloseAssigment: boolean;
    loadingGetTaskDetail: boolean;
    loadingCloseTask: boolean;
    loadingDeleteTask: boolean;
    loadingEditTask:boolean;

    errorLoadingFetchTasks: boolean;
    errorCreatePartialClosure: boolean;
    errorClosePartialClosure: boolean;
    errorGetTask: boolean;
    errorgetEmployees: boolean;
    errorCloseAssignment: boolean;
    errorGetTaskDetails: boolean;

    fetchTasks: (id: TaskWeeklyPlan['id']) => Promise<void>
    reloadTasks: (id: TaskWeeklyPlan['id']) => Promise<void>
    createPartialClosure: (id: TaskWeeklyPlan['id']) => Promise<void>
    closePartialClosure: (id: TaskWeeklyPlan['id']) => Promise<void>
    getTask: (id: TaskWeeklyPlan['id']) => Promise<void>
    getEmployees: (id: TaskWeeklyPlan['id']) => Promise<void>
    reduceSlots: (task: TaskWeeklyPlan) => void
    addSlots: (task: TaskWeeklyPlan) => void
    closeAssigment: (Employees: Employee[], Task: TaskWeeklyPlan) => Promise<void>
    getTaskDetailsById: (id: TaskWeeklyPlan['id']) => Promise<TaskWeeklyPlanDetails>
    closeTask: (id: TaskWeeklyPlan['id']) => Promise<void>
    deteleteTask: (id: TaskWeeklyPlan['id']) => Promise<void>
    cleanTask: (id: TaskWeeklyPlan['id']) => Promise<void>
    editTask: (data : DraftTaskWeeklyPlan, id: TaskWeeklyPlan['id']) => Promise<void>
}


export const createTaskWeeklyPlanSlice: StateCreator<TaskWeeklyPlanSliceType> = (set) => ({
    tasks: { week: 0, finca: '', lote: '', data: [] },
    task: {} as TaskWeeklyPlan,
    employees: [],

    loadingFetchTasks: false,
    loadingPartialClosure: false,
    loadingUpdateTask: false,
    loadingGetTask: false,
    loadingGetEmployees: false,
    loadingCloseAssigment: false,
    loadingGetTaskDetail: false,
    loadingCloseTask: false,
    loadingDeleteTask: false,
    loadingEditTask:false,

    errorLoadingFetchTasks: false,
    errorCreatePartialClosure: false,
    errorClosePartialClosure: false,
    errorGetTask: false,
    errorgetEmployees: false,
    errorCloseAssignment: false,
    errorGetTaskDetails: false,

    fetchTasks: async (id) => {
        set({ loadingFetchTasks: true });
        try {
            const url = `/api/tasks-lotes`;
            const { data } = await clienteAxios(url, {
                params: { id }
            });
            const result = TasksWeeklyPlanSchema.safeParse(data);
            if (result.success) {
                set({ loadingFetchTasks: false, tasks: result.data, errorLoadingFetchTasks: false });
            }
        } catch (error) {
            set({ loadingFetchTasks: false, errorLoadingFetchTasks: true });
            throw error;
        }
    },

    getTask: async (id) => {
        set({ loadingGetTask: true });
        try {
            const url = `/api/tasks-lotes/${id}`;
            const { data } = await clienteAxios(url);
            const result = TaskWeeklyPlanSchema.safeParse(data.data);
            if (result.success) {
                set({ loadingGetTask: false, task: result.data, errorGetTask: false });
            }
        } catch (error) {
            set({ loadingGetTask: false, errorGetTask: true });
            throw error;
        }
    },

    createPartialClosure: async (id) => {
        set({ loadingPartialClosure: true });
        try {
            const url = `/api/tasks-lotes/partial-close/close/${id}`;
            await clienteAxios.patch(url);
            set({ loadingPartialClosure: false, errorCreatePartialClosure: false });
        } catch (error: any) {
            set({ loadingPartialClosure: false, errorCreatePartialClosure: true });
            throw new Error;

        }
    },
    closePartialClosure: async (id) => {
        set({ loadingPartialClosure: true });
        try {
            const url = `/api/tasks-lotes/partial-close/open/${id}`;
            await clienteAxios.patch(url);
            set({ loadingPartialClosure: false, errorClosePartialClosure: false });
        } catch (error: any) {
            set({ loadingPartialClosure: false, errorClosePartialClosure: true });
            throw new Error;

        }
    },

    reloadTasks: async (id) => {
        set({ loadingUpdateTask: true });
        try {
            const url = `/api/tasks-lotes`;
            const { data } = await clienteAxios(url, {
                params: { id }
            });
            const result = TasksWeeklyPlanSchema.safeParse(data);
            if (result.success) {
                set({ loadingUpdateTask: false, tasks: result.data, errorLoadingFetchTasks: false });
            }
        } catch (error) {
            set({ loadingUpdateTask: false, errorLoadingFetchTasks: true });
            throw new Error;
        }
    },

    getEmployees: async (id) => {
        set({ loadingGetEmployees: true });
        try {
            const url = `/api/employees`;
            const { data } = await clienteAxios(url, {
                params: { id }
            });
            const result = EmployeesSchema.safeParse(data);
            if (result.success) {
                set({ loadingGetEmployees: false, employees: result.data.data, errorgetEmployees: false });
            }
        } catch (error) {
            set({ loadingGetEmployees: false, errorgetEmployees: true });
            throw error;
        }
    },
    closeAssigment: async (Employees, task) => {
        set({ loadingCloseAssigment: true })
        try {
            const url = `/api/tasks-lotes/close-assignment/${task.id}`
            await clienteAxios.post(url, {
                data: Employees
            });
            set({ loadingCloseAssigment: false });
        } catch (error) {
            set({ loadingCloseAssigment: false, errorCloseAssignment: true })
            throw error;
        }
    },
    reduceSlots: (task) => {
        const updatedTask = { ...task, slots: task.slots - 1 };
        set({ task: updatedTask });
    },
    addSlots: (task) => {
        const updatedTask = { ...task, slots: task.slots + 1 };
        set({ task: updatedTask });
    },
    getTaskDetailsById: async (id) => {
        set({ loadingGetTaskDetail: true });
        try {
            const url = `/api/tasks-lotes/${id}/details`;
            const { data } = await clienteAxios(url);
            const result = TaskWeeklyPlanDetailsSchema.safeParse(data.data);

            if (result.success) {
                set({ loadingGetTaskDetail: false });
                return result.data;
            } else {
                throw new Error("Failed to fetch task details");
            }
        } catch (error) {
            set({ loadingGetTaskDetail: false, errorGetTaskDetails: true })
            throw error;
        }
    },
    closeTask: async (id) => {
        set({ loadingCloseTask: true });

        try {
            const url = `/api/tasks-lotes/close/${id}`;
            await clienteAxios.patch(url);
            set({ loadingCloseTask: false });
        } catch (error) {
            throw new Error("Hubo un problema para cerrar la tarea");
        }
    },
    deteleteTask: async (id) => {
        set({ loadingDeleteTask: true });
        try {
            const url = `/api/tasks-lotes/${id}`;
            await clienteAxios.delete(url);
            set({ loadingDeleteTask: false });
        } catch (error) {
            throw new Error("Hubo un problema para cerrar la tarea");
        }
    },
    cleanTask: async (id) => {
        try {
            const url = `/api/tasks-lotes/erase/${id}`;
            await clienteAxios.delete(url);
        } catch (error) {
            throw new Error("Hubo un problema para limpiar la asignación");
        }
    },
    editTask: async (data,id) =>{
        set({loadingEditTask: true});
        try {
            const url = `/api/tasks-lotes/${id}`
            await clienteAxios.put(url,data);
            set({loadingEditTask: false});
        } catch (error) {
            set({loadingEditTask: false});
            throw new Error("Hubo un problema para limpiar la asignación");
        }
    }
})