import type { StateCreator } from "zustand";

export interface statusAppSlice {
    isSidebarOpen: boolean;
    changeSidebarState: () => void;
}

export const createStatusAppSlice: StateCreator<statusAppSlice, [], []> = (set) => ({
    isSidebarOpen: false,
    changeSidebarState: () => {
        set((state) => ({
            isSidebarOpen: !state.isSidebarOpen
        }));
    }
});