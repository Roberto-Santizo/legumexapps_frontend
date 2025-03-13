import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AuthSliceType, createAuthSlice } from './authSlice';
import { TaskCropWeeklyPlanSliceType, createTaskCropWeeklyPlanSlice } from './taskCropWeeklyPlanSlice';
import { DashboardAgricolaSliceType, createDashboardAgricolaSlice } from './DashboardAgricolaSlice';


export const useAppStore = create<AuthSliceType  & TaskCropWeeklyPlanSliceType & DashboardAgricolaSliceType>()(devtools((...a) => ({
    ...createAuthSlice(...a),
    ...createTaskCropWeeklyPlanSlice(...a),
    ...createDashboardAgricolaSlice(...a),
})))