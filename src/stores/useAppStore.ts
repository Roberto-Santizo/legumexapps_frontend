import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { UsersSliceType, createUsersSlice } from './usersSlice'

export const useAppStore = create<UsersSliceType>()(devtools((...a) => ({
    ...createUsersSlice(...a),
})))