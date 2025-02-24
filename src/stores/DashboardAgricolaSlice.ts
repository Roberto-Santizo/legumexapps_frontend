import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import {
    FinishedTasksByFincaSchema,
    FinishedTasksSchema, TasksInProgressSchema
} from "../utils/dashboard-schema";
import {
    FinishedTask, SummaryFincaTasks,
    TaskInProgress
} from "../types";

export type DashboardAgricolaSliceType = {
    getTasksCropFinished: () => Promise<FinishedTask[]>;
    getTasksCropInProgress: () => Promise<TaskInProgress[]>;
    getFinishedTasksByFinca: () => Promise<SummaryFincaTasks[]>;
};

export const createDashboardAgricolaSlice: StateCreator<DashboardAgricolaSliceType> = () => ({
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
