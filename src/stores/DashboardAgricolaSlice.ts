import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import {
    DronHoursSchema,
    FinishedTasksByFincaSchema,
    FinishedTasksSchema,
    SummaryHoursEmployeesSchema,
    TasksInProgressSchema,
} from "../utils/dashboard-schema";
import {
    FinishedTask,
    SummaryEmployeeHours,
    SummaryFincaTasks,
    TaskInProgress,
} from "../types";
import { permissions } from "../data/data";

export type DashboardAgricolaSliceType = {
    getDronHours: (permission : string) => Promise<number>;
    getSummaryHoursEmployees: () => Promise<SummaryEmployeeHours[]>;
    getTasksInProgress: (permission : string) => Promise<TaskInProgress[]>;
    getTasksFinished: (permission : string) => Promise<FinishedTask[]>;
    getTasksCropFinished: (permission : string) => Promise<FinishedTask[]>;
    getTasksCropInProgress: (permission : string) => Promise<TaskInProgress[]>;
    getFinishedTasksByFinca: () => Promise<SummaryFincaTasks[]>;
};

export const createDashboardAgricolaSlice: StateCreator<
    DashboardAgricolaSliceType
> = () => ({
    getDronHours: async (permission) => {
        try {
            const url = "/api/dron-hours";
            const { data } = await clienteAxios(url, {
                params: {
                    permission: permission,
                },
            });
            const result = DronHoursSchema.safeParse(data);
            if (result.success) {
                return result.data.hours;
            } else {
                throw new Error("Existe un error al traer las fincas");
            }
        } catch (error) {
            throw error;
        }
    },
    getSummaryHoursEmployees: async () => {
        try {
            const url = "/api/summary-hours-employees";
            const { data } = await clienteAxios(url);
            const result = SummaryHoursEmployeesSchema.safeParse(data);
            if (result.success) {
                return result.data.data;
            } else {
                throw new Error("Existe un error al traer las fincas");
            }
        } catch (error) {
            throw error;
        }
    },

    getTasksInProgress: async (permission) => {
        try {
            const url = "/api/tasks-in-progress";
            const { data } = await clienteAxios(url,{
                params:{
                    permission: permission
                }
            });
            const result = TasksInProgressSchema.safeParse(data);
            if (result.success) {
                return result.data.data;
            } else {
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },
    getTasksFinished: async (permission) => {
        try {
            const url = "/api/finished-tasks";
            const { data } = await clienteAxios(url,{
                params:{
                    permission: permission
                }
            });
            const result = FinishedTasksSchema.safeParse(data);
            if (result.success) {
                return result.data.data;
            } else {
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },
    getTasksCropInProgress: async (permission) => {
        try {
            const url = "/api/tasks-crops-in-progress";
            const { data } = await clienteAxios(url,{
                params:{
                    permission: permission
                }
            });
            const result = TasksInProgressSchema.safeParse(data);
            if (result.success) {
                return result.data.data;
            } else {
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },
    getTasksCropFinished: async (permission) => {
        try {
            const url = "/api/finished-tasks-crop";
            const { data } = await clienteAxios(url,{
                params:{
                    permission: permission
                }
            });
            const result = FinishedTasksSchema.safeParse(data);
            if (result.success) {
                return result.data.data;
            } else {
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },
    getFinishedTasksByFinca: async () => {
        try {
            const url = "/api/finished-total-tasks-finca";
            const { data } = await clienteAxios(url);
            const result = FinishedTasksByFincaSchema.safeParse(data);
            if (result.success) {
                return result.data.data;
            } else {
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },
});
