import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { UsersSliceType, createUsersSlice } from './usersSlice';
import { AuthSliceType, createAuthSlice } from './authSlice';
import { RolesSliceType, createRolesSlice } from './rolesSlice';

export const useAppStore = create<UsersSliceType & AuthSliceType & RolesSliceType>()(devtools((...a) => ({
    ...createUsersSlice(...a),
    ...createAuthSlice(...a),
    ...createRolesSlice(...a),
})))