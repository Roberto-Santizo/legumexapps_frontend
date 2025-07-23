import type { StateCreator } from "zustand";

export type TaskProductionUnscheduledFilters = {
    sku: string;
    line: string;
    product: string;
}

export type TasksWithOperationDateFilters = {
    line: string;
    status: string;
    sku: string;
}

const filtersNoOperationDateInitialValues = {
    sku: '',
    line: '',
    product: ''
}

const filtersWithOperationDateInitialValues = {
    line: '',
    status: '',
    sku: ''
}

export interface PlanificationProductionSlice {
    filtersNoOperationDate: TaskProductionUnscheduledFilters;
    filtersWithOperationDate: TasksWithOperationDateFilters;
    handleChangefiltersNoOperationDate: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleChangefiltersOperationDate: (filters: TasksWithOperationDateFilters) => void;
}

export const createPlanificationProductionSlice: StateCreator<PlanificationProductionSlice, [], []> = (set) => ({
    filtersNoOperationDate: filtersNoOperationDateInitialValues,
    filtersWithOperationDate: filtersWithOperationDateInitialValues,
    handleChangefiltersNoOperationDate: (e) => {
        const { id, value } = e.target;

        set((state) => ({
            filtersNoOperationDate: {
                ...state.filtersNoOperationDate,
                [id]: value,
            },
        }));
    },
    handleChangefiltersOperationDate: (filters) => {
        set(() => ({
            filtersWithOperationDate: filters
        }));
    }
});