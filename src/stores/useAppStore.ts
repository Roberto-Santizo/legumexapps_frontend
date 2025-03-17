import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AuthSliceType, createAuthSlice } from './authSlice';


export const useAppStore = create<AuthSliceType>()(devtools((...a) => ({
    ...createAuthSlice(...a),
})))