import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { UsersSliceType, createUsersSlice } from './usersSlice';
import { AuthSliceType, createAuthSlice } from './authSlice';

export const useAppStore = create<UsersSliceType & AuthSliceType>()(devtools((...a) => ({
    ...createUsersSlice(...a),
    ...createAuthSlice(...a),
})))