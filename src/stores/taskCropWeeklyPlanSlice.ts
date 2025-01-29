import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { Employee, EmployeeCrop, EmployeesCrop, TaskCropIncomplete, TaskCropWeeklyPlan, TaskCropWeeklyPlanDetail, TasksCropWeeklyPlan, TaskWeeklyPlan } from "../types";
import { TasksCropIncompleteSchema, TaskCropWeeklyPlanSchema, TasksCropWeeklyPlanSchema, EmployeesTaskCropPlanSchema, TaskCropWeeklyPlanDetailSchema } from "../utils/taskCropWeeklyPlan-schema";

export type TaskCropWeeklyPlanSliceType = {
    tasksCrops: TasksCropWeeklyPlan;
    taskCrop: TaskCropWeeklyPlan;
    CropEmployees: EmployeesCrop;
    idTakeLbsData: TaskCropWeeklyPlan['id'];

    loadingGetTasks: boolean;
    loadingGetTask: boolean;
    loadingGetEmployees: boolean;
    loadingCloseAssigment: boolean;
    loadingCloseTask: boolean;
    loadingRegisterDailyAssigments: boolean;
    loadingReloadTasks:boolean;

    modalTomaLibras: boolean;

    errorGetTasks: boolean;
    errorGetTask: boolean;
    errorgetEmployees: boolean;
    errorCloseAssignment: boolean;

    getTasksCrop: (id: TaskWeeklyPlan['lote_plantation_control_id'], weekly_plan_id: TaskWeeklyPlan['weekly_plan_id']) => Promise<void>
    getTaskCrop: (id: TaskCropWeeklyPlan['id']) => Promise<void>
    getTaskCropDetails: (id: TaskCropWeeklyPlan['id']) => Promise<TaskCropWeeklyPlanDetail>

    getCropEmployees: (id: TaskCropWeeklyPlan['finca_id']) => Promise<void>
    closeCropAssigment: (Employees: Employee[], task_crop_id: TaskCropWeeklyPlan['id']) => Promise<void>

    closeDailyAssignment: (id: TaskCropWeeklyPlan['id'], data: EmployeeCrop[], plants: Number) => Promise<void>
    closeWeekAssignment: (id: TaskCropWeeklyPlan['id']) => Promise<void>;

    reloadTasks: (id: TaskWeeklyPlan['lote_plantation_control_id'], weekly_plan_id: TaskWeeklyPlan['weekly_plan_id']) => Promise<void>
    getIncompleteAssigments: (id: TaskCropWeeklyPlan['id']) => Promise<TaskCropIncomplete[]>
    completeAssigments: (data : TaskCropIncomplete[]) => Promise<void>
    openModal: (id: TaskCropWeeklyPlan['id']) => void
    closeModal: () => void
}


export const createTaskCropWeeklyPlanSlice: StateCreator<TaskCropWeeklyPlanSliceType> = (set) => ({
    tasksCrops: {} as TasksCropWeeklyPlan,
    taskCrop: {} as TaskCropWeeklyPlan,
    CropEmployees: {} as EmployeesCrop,
    modalTomaLibras: false,
    idTakeLbsData: '',

    loadingGetTasks: false,
    loadingGetTask: false,
    loadingGetEmployees: false,
    loadingCloseAssigment: false,
    loadingCloseTask: false,
    loadingRegisterDailyAssigments: false,
    loadingReloadTasks: false,

    errorGetTasks: false,
    errorGetTask: false,
    errorgetEmployees: false,
    errorCloseAssignment: false,

    getTasksCrop: async (lote_plantation_control_id, weekly_plan_id) => {
        set({ loadingGetTasks: true });
        try {
            const url = `/api/tasks-crops-lotes`;
            const { data } = await clienteAxios(url, {
                params: { lote_plantation_control_id, weekly_plan_id }
            });
            const result = TasksCropWeeklyPlanSchema.safeParse(data);
            if (result.success) {
                set({ loadingGetTasks: false, tasksCrops: result.data, errorGetTasks: false });
            }
        } catch (error) {
            set({loadingGetTask: false, errorGetTask: true});
            throw error;
        }
    },

    getTaskCrop: async (id) => {
        set({ loadingGetTask: true });
        try {
            const url = `/api/tasks-crops-lotes/${id}`;
            const { data } = await clienteAxios(url);
            const result = TaskCropWeeklyPlanSchema.safeParse(data.data);
            if (result.success) {
                set({ loadingGetTask: false, taskCrop: result.data, errorGetTask: false });
            }
        } catch (error) {
            set({ loadingGetTask: false, errorGetTask: true });
            throw error;
        }
    },
    getTaskCropDetails: async (id) => {
        set({ loadingGetTask: true });
        try {
            const url = `/api/tasks-crops-lotes/details/${id}`;
            const { data } = await clienteAxios(url);
            const result = TaskCropWeeklyPlanDetailSchema.safeParse(data);
            if (result.success) {
                set({ loadingGetTask: false });
                return result.data;
            } else {
                set({ loadingGetTask: false });
                throw new Error('Invalid data');
            }
        } catch (error) {
            set({ loadingGetTask: false });
            throw error;
        }
    },

    reloadTasks: async (lote_plantation_control_id, weekly_plan_id) => {
        set({ loadingReloadTasks: true });
        try {
            const url = `/api/tasks-crops-lotes`;
            const { data } = await clienteAxios(url, {
                params: { lote_plantation_control_id, weekly_plan_id }
            });
            const result = TasksCropWeeklyPlanSchema.safeParse(data);
            if (result.success) {
                set({ loadingReloadTasks: false, tasksCrops: result.data, errorGetTasks: false });
            }
        } catch (error) {
            set({ loadingReloadTasks: false, errorGetTasks: true });
            throw new Error;
        }
    },

    closeCropAssigment: async (Employees, task_crop_id) => {
        set({ loadingCloseAssigment: true })
        try {
            const url = `/api/tasks-crops-lotes/close-assignment/${task_crop_id}`
            await clienteAxios.post(url, {
                data: Employees
            });
            set({ loadingCloseAssigment: false });
        } catch (error) {
            set({ loadingCloseAssigment: false, errorCloseAssignment: true })
            throw error;
        }
    },
    closeDailyAssignment: async (id, dataEmployees, plants) => {
        set({ loadingCloseTask: true })
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

            set({ loadingCloseTask: false, errorCloseAssignment: false });
        } catch (error) {
            set({ loadingCloseTask: false, errorCloseAssignment: true });
            throw error;
        }

    },

    closeWeekAssignment: async(id) => {
        set({loadingCloseTask: true});
        try {
            const url = `/api/tasks-crops-lotes/${id}`;
            await clienteAxios.patch(url);
            set({loadingCloseTask: false});
        } catch (error) {
            throw error;
        }
    },
    getIncompleteAssigments: async (id) => {
        set({ loadingGetTask: true });
        try {
            const url = `/api/tasks-crops-lotes/incomplete-assigments/${id}`;
            const { data } = await clienteAxios(url);
            const result = TasksCropIncompleteSchema.safeParse(data);
            if (result.success) {
                set({loadingGetTask:false});
                return result.data.data;
            } else {
                set({loadingGetTask:false, errorGetTask: true});
                return [];
            }
        } catch (error) {
            set({loadingGetTask:false, errorGetTask: true});
            return [];
        }
    },
    getCropEmployees: async (id) => {
        set({ loadingGetEmployees: true });
        try {
            const url = `/api/tasks-crops-lotes/employees/${id}`;
            const { data } = await clienteAxios(url);

            const result = EmployeesTaskCropPlanSchema.safeParse(data);

            if (result.success) {
                set({ loadingGetEmployees: false, CropEmployees: result.data, errorgetEmployees: false });
            }
        } catch (error) {
            set({ loadingGetEmployees: false, errorgetEmployees: true });
            throw error;
        }
    },
    completeAssigments: async (data) => {
        set({loadingRegisterDailyAssigments: true});
        try {
            const url = '/api/tasks-crops-lotes/register-daily-assigment'
            await clienteAxios.post(url,data);
            set({loadingRegisterDailyAssigments: false})
        } catch (error) {
            set({loadingRegisterDailyAssigments: false})
            throw error;
        }
    },
    openModal: (id) => {
        set({ modalTomaLibras: true, idTakeLbsData: id })
    },
    closeModal: () => {
        set({ modalTomaLibras: false })
    }
})