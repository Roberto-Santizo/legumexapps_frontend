import { StateCreator } from "zustand"
import { AuthAPIUser, AuthUser } from "../types"
import clienteAxios from "../config/axios";

export type AuthSliceType = {
    loadingAuth: boolean,
    logedIn: boolean,
    errors: string[],
    AuthUser: AuthAPIUser,
    login: (user: AuthUser) => Promise<void>,
    logOut: () => Promise<void>
}


export const createAuthSlice: StateCreator<AuthSliceType> = (set) => ({
    loadingAuth: false,
    logedIn: sessionStorage.getItem('AUTH_TOKEN') ? true : false,
    errors: [],
    AuthUser: sessionStorage.getItem('AUTH_USER') ? JSON.parse(sessionStorage.getItem('AUTH_USER') as string) : {},
    login: async (user) => {
        const url = 'http://127.0.0.1:8000/api/login';

        try {
            set({ loadingAuth: true });
            const { data } = await clienteAxios.post(url, user);
            sessionStorage.setItem('AUTH_TOKEN', data.token);
            sessionStorage.setItem('AUTH_USER', JSON.stringify(data.user));
            set({ logedIn: true, loadingAuth: false, errors:[], AuthUser: data.user });
        } catch (error : any) {
            set({ errors: Object.values(error.response.data.errors) , loadingAuth: false });
        }
    },
    logOut: async () => {

        try {
            set({ loadingAuth: true });
            await clienteAxios.post('/api/logout',null,{
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            });
            sessionStorage.removeItem('AUTH_TOKEN');
            sessionStorage.removeItem('AUTH_USER');
            set({ logedIn: false, AuthUser: {} as AuthAPIUser, loadingAuth: false });
        } catch (error) {
            console.log(error);
        }
    }

})