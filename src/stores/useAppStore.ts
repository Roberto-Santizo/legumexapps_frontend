import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AuthSliceType, createAuthSlice } from './authSlice';
import { DashboardAgricolaSliceType, createDashboardAgricolaSlice } from './DashboardAgricolaSlice';


export const useAppStore = create<AuthSliceType & DashboardAgricolaSliceType>()(devtools((...a) => ({
    ...createAuthSlice(...a),
    ...createDashboardAgricolaSlice(...a),
})))