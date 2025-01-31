import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { Employee, EmployeeCrop, EmployeesCrop, TaskCropIncomplete, TaskCropWeeklyPlan, TaskCropWeeklyPlanDetail, TasksCropWeeklyPlan, TaskWeeklyPlan } from "../types";
import { TasksCropIncompleteSchema, TaskCropWeeklyPlanSchema, TasksCropWeeklyPlanSchema, EmployeesTaskCropPlanSchema, TaskCropWeeklyPlanDetailSchema } from "../utils/taskCropWeeklyPlan-schema";

export type TaskCropWeeklyPlanSliceType = {
    idTakeLbsData: TaskCropWeeklyPlan['id'];
    tasksCrops: TasksCropWeeklyPlan;
    loadingReloadTasks:boolean;
    modalTomaLibras: boolean;

    getTasksCrop: (id: TaskWeeklyPlan['lote_plantation_control_id'], weekly_plan_id: TaskWeeklyPlan['weekly_plan_id']) => Promise<void>
    getTaskCrop: (id: TaskCropWeeklyPlan['id']) => Promise<TaskCropWeeklyPlan>
    getCropEmployees: (id: TaskCropWeeklyPlan['finca_id']) => Promise<EmployeesCrop>
    getTaskCropDetails: (id: TaskCropWeeklyPlan['id']) => Promise<TaskCropWeeklyPlanDetail>
    closeCropAssigment: (Employees: Employee[], task_crop_id: TaskCropWeeklyPlan['id']) => Promise<void>
    closeDailyAssignment: (id: TaskCropWeeklyPlan['id'], data: EmployeeCrop[], plants: Number) => Promise<void>
    closeWeekAssignment: (id: TaskCropWeeklyPlan['id']) => Promise<void>;
    getIncompleteAssigments: (id: TaskCropWeeklyPlan['id']) => Promise<TaskCropIncomplete[]>
    completeAssigments: (data : TaskCropIncomplete[]) => Promise<void>
    openModal: (id: TaskCropWeeklyPlan['id']) => void
    closeModal: () => void
}


export const createTaskCropWeeklyPlanSlice: StateCreator<TaskCropWeeklyPlanSliceType> = (set) => ({
    modalTomaLibras: false,
    idTakeLbsData: '',
    tasksCrops: {} as TasksCropWeeklyPlan,

    loadingReloadTasks: false,

    getTasksCrop: async (lote_plantation_control_id, weekly_plan_id) => {
        set({loadingReloadTasks: true});
        try {
            const url = `/api/tasks-crops-lotes`;
            const { data } = await clienteAxios(url, {
                params: { lote_plantation_control_id, weekly_plan_id }
            });
            const result = TasksCropWeeklyPlanSchema.safeParse(data);
            if (result.success) {
                set({tasksCrops: result.data});
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }finally {
            set({loadingReloadTasks: false});
        }
    },

    getTaskCrop: async (id) => {
        try {
            const url = `/api/tasks-crops-lotes/${id}`;
            const { data } = await clienteAxios(url);
            const result = TaskCropWeeklyPlanSchema.safeParse(data.data);
            if (result.success) {
                return result.data;
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },
    getTaskCropDetails: async (id) => {
        try {
            const url = `/api/tasks-crops-lotes/details/${id}`;
            const { data } = await clienteAxios(url);
            const result = TaskCropWeeklyPlanDetailSchema.safeParse(data);
            if (result.success) {
                return result.data;
            } else {
                throw new Error('Invalid data');
            }
        } catch (error) {
            throw error;
        }
    },

    closeCropAssigment: async (Employees, task_crop_id) => {
        try {
            const url = `/api/tasks-crops-lotes/close-assignment/${task_crop_id}`
            await clienteAxios.post(url, {
                data: Employees
            });
        } catch (error) {
            throw error;
        }
    },
    closeDailyAssignment: async (id, dataEmployees, plants) => {
        try {
            const totalLbs = dataEmployees.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue.lbs || 0);
            }, 0);
            const url = `/api/tasks-crops-lotes/close-daily-assigment/${id}`
            await clienteAxios.post(url, {
                task_crop_id: id,
                lbs_finca: totalLbs,
                plants: plants,
                assigments: dataEmployees
            });
        } catch (error) {
            throw error;
        }

    },

    closeWeekAssignment: async(id) => {
        try {
            const url = `/api/tasks-crops-lotes/${id}`;
            await clienteAxios.patch(url);
        } catch (error) {
            throw error;
        }
    },
    getIncompleteAssigments: async (id) => {
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
            return [];
        }
    },
    getCropEmployees: async (id) => {
        try {
            const url = `/api/tasks-crops-lotes/employees/${id}`;
            const { data } = await clienteAxios(url);

            const result = EmployeesTaskCropPlanSchema.safeParse(data);

            if (result.success) {
                return result.data;
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },
    completeAssigments: async (data) => {
        try {
            const url = '/api/tasks-crops-lotes/register-daily-assigment'
            await clienteAxios.post(url,data);
        } catch (error) {
            throw error;
        }
    },
    openModal: (id) => {
        set({ modalTomaLibras: true, idTakeLbsData: id })
    },
    closeModal: () => {
        set({ modalTomaLibras: false, idTakeLbsData:'' })
    }
})