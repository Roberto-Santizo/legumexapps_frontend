import { StateCreator } from "zustand"
import clienteAxios from "../config/axios"
import { Employee, TasksWeeklyPlan, TaskWeeklyPlan } from "../types"
import { TasksWeeklyPlanSchema, TaskWeeklyPlanSchema } from "../utils/taskWeeklyPlan-schema";
import { EmployeesSchema } from "../utils/employee-schema";

export type TaskWeeklyPlanSliceType = {
    tasks: TasksWeeklyPlan;
    task: TaskWeeklyPlan;
    employees: Employee[];

    loadingFetchTasks: boolean;
    loadingPartialClosure: boolean;
    loadingUpdateTask: boolean;
    loadingGetTask:boolean;
    loadingGetEmployees:boolean;

    errorLoadingFetchTasks: boolean;
    errorCreatePartialClosure: boolean;
    errorClosePartialClosure:boolean;
    errorGetTask:boolean;
    errorgetEmployees:boolean;

    fetchTasks: (id : TaskWeeklyPlan['id']) => Promise<void>
    reloadTasks: (id : TaskWeeklyPlan['id']) => Promise<void>
    createPartialClosure: (id: TaskWeeklyPlan['id']) => Promise<void>
    closePartialClosure: (id: TaskWeeklyPlan['id']) => Promise<void>
    getTask: (id: TaskWeeklyPlan['id']) => Promise<void>
    getEmployees: (id: TaskWeeklyPlan['id']) => Promise<void>
    reduceSlots: (task : TaskWeeklyPlan) => void
    addSlots: (task : TaskWeeklyPlan) => void
    closeAssigment: (Employees: Employee[], Task: TaskWeeklyPlan) => void
}


export const createTaskWeeklyPlanSlice: StateCreator<TaskWeeklyPlanSliceType> = (set) => ({
    tasks: { week: 0, finca: '',lote: '', data: [] },
    task: {} as TaskWeeklyPlan,
    employees: [],

    loadingFetchTasks: false,
    loadingPartialClosure:false,
    loadingUpdateTask:false,
    loadingGetTask:false,
    loadingGetEmployees:false,
    
    errorLoadingFetchTasks: false,
    errorCreatePartialClosure: false,
    errorClosePartialClosure: false,
    errorGetTask:false,
    errorgetEmployees:false,
    
    fetchTasks: async (id) => {
        set({loadingFetchTasks: true});
        try {
            const url = `/api/tasks-lotes`;
            const { data } = await clienteAxios(url,{
                params: {id}
            });
            const result = TasksWeeklyPlanSchema.safeParse(data);
            if(result.success){
                set({loadingFetchTasks: false, tasks: result.data, errorLoadingFetchTasks:false});
            }
        } catch (error) {
            set({loadingFetchTasks: false, errorLoadingFetchTasks:true});
            throw error;
        } 
    },

    getTask: async (id) => {
       set({loadingGetTask: true});
       try {
            const url = `/api/tasks-lotes/${id}`;
            const { data } = await clienteAxios(url);
            const result = TaskWeeklyPlanSchema.safeParse(data.data);
            if(result.success){
                set({loadingGetTask: false, task: result.data, errorGetTask:false});
            }
       } catch (error) {
         set({loadingGetTask: false, errorGetTask:true});
         throw error;
       }
    },

    createPartialClosure: async (id) => {
        set({loadingPartialClosure: true});
        try {
            const url = `/api/tasks-lotes/partial-close/close/${id}`;
            await clienteAxios.patch(url);
            set({loadingPartialClosure: false, errorCreatePartialClosure: false});
        } catch (error : any) {
            set({loadingPartialClosure: false, errorCreatePartialClosure: true});
            throw new Error;
            
        }
    },
    closePartialClosure: async (id) => {
        set({loadingPartialClosure: true});
        try {
            const url = `/api/tasks-lotes/partial-close/open/${id}`;
            await clienteAxios.patch(url);
            set({loadingPartialClosure: false, errorClosePartialClosure: false});
        } catch (error : any) {
            set({loadingPartialClosure: false, errorClosePartialClosure: true});
            throw new Error;
            
        }
    },

    reloadTasks: async (id) => {
        set({loadingUpdateTask: true});
        try {
            const url = `/api/tasks-lotes`;
            const { data } = await clienteAxios(url,{
                params: {id}
            });
            const result = TasksWeeklyPlanSchema.safeParse(data);
            if(result.success){
                set({loadingUpdateTask: false, tasks: result.data, errorLoadingFetchTasks:false});
            }
        } catch (error) {
            set({loadingUpdateTask: false, errorLoadingFetchTasks:true});
            throw new Error;
        } 
    },

    getEmployees: async (id) => {
        set({loadingGetEmployees: true});
       try {
            const url = `/api/employees`;
            const { data } = await clienteAxios(url,{
                params: {id}
            });
            const result = EmployeesSchema.safeParse(data);
            if(result.success){
                set({loadingGetEmployees: false, employees: result.data.data, errorgetEmployees:false});
            }
       } catch (error) {
         set({loadingGetEmployees: false, errorgetEmployees:true});
         throw error;
       }
    },
    closeAssigment: async (Employees, Task) => {
        console.log(Employees, Task);
    },
    reduceSlots: (task) => {
        const updatedTask = { ...task, slots: task.slots - 1 };
        set({ task: updatedTask });
    },
    addSlots: (task) => {
        const updatedTask = { ...task, slots: task.slots + 1 };
        set({ task: updatedTask });
    }
})