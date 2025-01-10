import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { UsersSliceType, createUsersSlice } from './usersSlice';
import { AuthSliceType, createAuthSlice } from './authSlice';
import { RolesSliceType, createRolesSlice } from './rolesSlice';
import { PermissionsSliceType, createPermissionsSlice } from './permissionsSlice';
import { TareasSliceType, createTareasSlice } from './tareasSlice';
import { ControlPlantationSliceType, createControlPlantationSlice } from './controlPlantationSlice';

export const useAppStore = create<UsersSliceType & AuthSliceType & RolesSliceType & PermissionsSliceType & TareasSliceType & ControlPlantationSliceType>()(devtools((...a) => ({
    ...createUsersSlice(...a),
    ...createAuthSlice(...a),
    ...createRolesSlice(...a),
    ...createPermissionsSlice(...a),
    ...createTareasSlice(...a),
    ...createControlPlantationSlice(...a),
})))