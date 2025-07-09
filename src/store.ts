import { createPlanificationProductionSlice, PlanificationProductionSlice } from "@/stores/planificationProductionSlice";
import { create } from "zustand";

export const useAppStore = create<PlanificationProductionSlice>((...a) => ( {
    ...createPlanificationProductionSlice(...a)
}));