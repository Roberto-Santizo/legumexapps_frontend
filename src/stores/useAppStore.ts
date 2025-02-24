import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AuthSliceType, createAuthSlice } from './authSlice';
import { TaskWeeklyPlanSliceType, createTaskWeeklyPlanSlice } from './taskWeeklyPlanSlice';
import { TaskCropWeeklyPlanSliceType, createTaskCropWeeklyPlanSlice } from './taskCropWeeklyPlanSlice';
import { DashboardAgricolaSliceType, createDashboardAgricolaSlice } from './DashboardAgricolaSlice';


export const useAppStore = create<AuthSliceType  & TaskWeeklyPlanSliceType & TaskCropWeeklyPlanSliceType & DashboardAgricolaSliceType>()(devtools((...a) => ({
    ...createAuthSlice(...a),
    ...createTaskWeeklyPlanSlice(...a),
    ...createTaskCropWeeklyPlanSlice(...a),
    ...createDashboardAgricolaSlice(...a),
})))