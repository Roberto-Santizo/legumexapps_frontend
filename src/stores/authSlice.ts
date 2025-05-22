import { StateCreator } from "zustand";
import { AuthUser } from "../types";

export type AuthSliceType = {
    AuthUser: AuthUser;
}

export const createAuthSlice: StateCreator<AuthSliceType> = () => ({
    AuthUser: localStorage.getItem('AUTH_USER') ? JSON.parse(localStorage.getItem('AUTH_USER') as string) : {} as AuthUser,
})