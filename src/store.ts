import { createPlanificationProductionSlice, PlanificationProductionSlice } from "@/stores/planificationProductionSlice";
import { create } from "zustand";
import { createStatusAppSlice, statusAppSlice } from "./stores/statusAppSlice";

export const useAppStore = create<PlanificationProductionSlice & statusAppSlice>((...a) => ({
    ...createPlanificationProductionSlice(...a),
    ...createStatusAppSlice(...a),
}));