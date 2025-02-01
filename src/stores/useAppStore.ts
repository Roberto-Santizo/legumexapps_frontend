import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { UsersSliceType, createUsersSlice } from './usersSlice';
import { AuthSliceType, createAuthSlice } from './authSlice';
import { RolesSliceType, createRolesSlice } from './rolesSlice';
import { PermissionsSliceType, createPermissionsSlice } from './permissionsSlice';
import { TareasSliceType, createTareasSlice } from './tareasSlice';
import { ControlPlantationSliceType, createControlPlantationSlice } from './controlPlantationSlice';
import { LoteSliceType, createLoteSlice } from './LoteSlice';
import { FincaSliceType, createFincaSlice } from './fincaSlice';
import { WeeklyPlansSliceType, createWeeklyPlansSlice } from './weeklyPlansSlice';
import { TaskWeeklyPlanSliceType, createTaskWeeklyPlanSlice } from './taskWeeklyPlanSlice';
import { TaskCropWeeklyPlanSliceType, createTaskCropWeeklyPlanSlice } from './taskCropWeeklyPlanSlice';
import { InsumosSliceType, createInsumosSlice } from './insumosSlice';

export const useAppStore = create<UsersSliceType & AuthSliceType & RolesSliceType & PermissionsSliceType & TareasSliceType & ControlPlantationSliceType & LoteSliceType & FincaSliceType & WeeklyPlansSliceType & TaskWeeklyPlanSliceType & TaskCropWeeklyPlanSliceType & InsumosSliceType>()(devtools((...a) => ({
    ...createUsersSlice(...a),
    ...createAuthSlice(...a),
    ...createRolesSlice(...a),
    ...createPermissionsSlice(...a),
    ...createTareasSlice(...a),
    ...createControlPlantationSlice(...a),
    ...createLoteSlice(...a),
    ...createFincaSlice(...a),
    ...createWeeklyPlansSlice(...a),
    ...createTaskWeeklyPlanSlice(...a),
    ...createTaskCropWeeklyPlanSlice(...a),
    ...createInsumosSlice(...a)
})))