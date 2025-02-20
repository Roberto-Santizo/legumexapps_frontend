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

export type DashboardAgricolaSliceType = {
    getDronHours: () => Promise<number>;
    getSummaryHoursEmployees: () => Promise<SummaryEmployeeHours[]>;
    getTasksInProgress: () => Promise<TaskInProgress[]>;
    getTasksFinished: () => Promise<FinishedTask[]>;
    getTasksCropFinished: () => Promise<FinishedTask[]>;
    getTasksCropInProgress: () => Promise<TaskInProgress[]>;
    getFinishedTasksByFinca: () => Promise<SummaryFincaTasks[]>;
};

export const createDashboardAgricolaSlice: StateCreator<
    DashboardAgricolaSliceType
> = () => ({
    getDronHours: async () => {
        try {
            const url = "/api/dron-hours";
            const { data } = await clienteAxios(url);
            const result = DronHoursSchema.safeParse(data);
            if (result.success) {
                return result.data.hours;
            } else {
                throw new Error("Existe un error al traer las fincas");
            }
        } catch (error) {
            console.log(error);
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
            console.log(error);
            throw error;
        }
    },

    getTasksInProgress: async () => {
        try {
            const url = "/api/tasks-in-progress";
            const { data } = await clienteAxios(url);
            const result = TasksInProgressSchema.safeParse(data);
            if (result.success) {
                return result.data.data;
            } else {
                throw new Error("Información no válida");
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    getTasksFinished: async () => {
        try {
            const url = "/api/finished-tasks";
            const { data } = await clienteAxios(url);
            const result = FinishedTasksSchema.safeParse(data);
            if (result.success) {
                return result.data.data;
            } else {
                throw new Error("Información no válida");
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    getTasksCropInProgress: async () => {
        try {
            const url = "/api/tasks-crops-in-progress";
            const { data } = await clienteAxios(url);
            const result = TasksInProgressSchema.safeParse(data);
            if (result.success) {
                return result.data.data;
            } else {
                throw new Error("Información no válida");
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    getTasksCropFinished: async () => {
        try {
            const url = "/api/finished-tasks-crop";
            const { data } = await clienteAxios(url);
            const result = FinishedTasksSchema.safeParse(data);
            if (result.success) {
                return result.data.data;
            } else {
                throw new Error("Información no válida");
            }
        } catch (error) {
            console.log(error);
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
            console.log(error);
            throw error;
        }
    },
});
