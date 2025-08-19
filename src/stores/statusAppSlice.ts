import type { StateCreator } from "zustand";

export interface statusAppSlice {
    isSidebarOpen: boolean;
    changeSidebarState: () => void;
    isStatic: boolean;
    setIsStatic: () => void;
}

export const createStatusAppSlice: StateCreator<statusAppSlice, [], []> = (set, get) => ({
    isSidebarOpen: true,
    isStatic: false,
    changeSidebarState: () => {
        if (get().isStatic) return;

        set((state) => ({
            isSidebarOpen: !state.isSidebarOpen
        }));
    },
    setIsStatic: () => {
        if (!get().isSidebarOpen) {
            set((state) => ({
                isStatic: !state.isStatic,
                isSidebarOpen: true
            }));
        } else {
            set((state) => ({
                isStatic: !state.isStatic,
            }));
        };
    }
});