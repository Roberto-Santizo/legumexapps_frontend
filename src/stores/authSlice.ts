import { StateCreator } from "zustand";
import { AuthUser, LoginUser, User } from "../types";
import clienteAxios from "../config/axios";
import { AuthUserSchema } from "../utils/users-schema";
import { userRoleSchema } from "../utils/roles-schema";

export type AuthSliceType = {
    loadingGetUser: boolean;
    loadingGetRole: boolean;

    logedIn: boolean;
    
    
    Autherrors: string[];
    getUserByTokenError: boolean;
    errorgetRole: boolean;
    
    AuthUser: AuthUser;
    
    userRole: string;

    login: (user: LoginUser) => Promise<void>;
    logOut: () => Promise<void>;
    getUserByToken: () => Promise<void>;
    getUserRoleByToken: () => Promise<string>;
}


export const createAuthSlice: StateCreator<AuthSliceType> = (set) => ({
    loadingGetUser: false,
    loadingGetRole: false,

    userRole: '',

    logedIn: localStorage.getItem('AUTH_TOKEN') ? true : false,

    Autherrors: [],
    errorgetRole: false,
    getUserByTokenError: false,
    AuthUser:   localStorage.getItem('AUTH_USER') ? JSON.parse(localStorage.getItem('AUTH_USER') as string) : {} as AuthUser,
    login: async (user) => {
        const url = '/api/login';
        try {
            const { data } = await clienteAxios.post(url, user);
            localStorage.setItem('AUTH_TOKEN', data.token);
            localStorage.setItem('AUTH_USER', JSON.stringify(data.user));
            set({ logedIn: true, Autherrors:[]});
            return Promise.resolve(data); 
        } catch (error : any) {
            set({ Autherrors: Object.values(error.response.data.errors)});
            throw error;
        }
    },
    logOut: async () => {
        try {
            await clienteAxios.post('/api/logout',null);
            localStorage.removeItem('AUTH_TOKEN');
            localStorage.removeItem('AUTH_USER');
            set({ logedIn: false});
        } catch (error) {
            throw error;
        }
    },
    getUserByToken: async () => { 
        set({loadingGetUser: false});
        try {
            const url = '/api/user';
            const { data } = await clienteAxios(url);

            const result = AuthUserSchema.safeParse(data.data);
            if(result.success){
                set({ AuthUser: result.data, loadingGetUser: false });
            }
        } catch (error) {
            set({getUserByTokenError: true, loadingGetUser: false});
            throw error;
        }
    },
    getUserRoleByToken: async () => {
        try {
            const url = '/api/roles/user';
            const { data } = await clienteAxios(url);

            const result = userRoleSchema.safeParse(data);
            if(result.success){
                return result.data.name
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    }

})