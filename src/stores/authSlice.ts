import { StateCreator } from "zustand"
import { AuthUser, User } from "../types"
import clienteAxios from "../config/axios";
import { UserSchema } from "../utils/users-schema";
import { userRoleSchema } from "../utils/roles-schema";

export type AuthSliceType = {
    loadingAuth: boolean;
    loadingGetUser: boolean;
    loadingGetRole: boolean;

    logedIn: boolean;
    
    
    Autherrors: string[];
    getUserByTokenError: boolean;
    errorgetRole: boolean;
    
    AuthUser: User;
    userRole: string;

    login: (user: AuthUser) => Promise<void>;
    logOut: () => Promise<void>;
    getUserByToken: () => Promise<void>;
    getUserRoleByToken: () => Promise<void>;
}


export const createAuthSlice: StateCreator<AuthSliceType> = (set) => ({
    loadingAuth: false,
    loadingGetUser: false,
    loadingGetRole: false,

    userRole: '',

    logedIn: sessionStorage.getItem('AUTH_TOKEN') ? true : false,

    Autherrors: [],
    errorgetRole: false,
    getUserByTokenError: false,
    AuthUser: {} as User,
    login: async (user) => {
        const url = '/api/login';
        try {
            set({ loadingAuth: true });
            const { data } = await clienteAxios.post(url, user);
            sessionStorage.setItem('AUTH_TOKEN', data.token);
            set({ logedIn: true, loadingAuth: false, Autherrors:[] });
            return Promise.resolve(data); 
        } catch (error : any) {
            set({ Autherrors: Object.values(error.response.data.errors) , loadingAuth: false });
        }
    },
    logOut: async () => {

        try {
            set({ loadingAuth: true });
            await clienteAxios.post('/api/logout',null);
            sessionStorage.removeItem('AUTH_TOKEN');
            sessionStorage.removeItem('AUTH_USER');
            set({ logedIn: false, loadingAuth: false });
        } catch (error) {
            console.log(error);
        }
    },
    getUserByToken: async () => { 
        set({loadingGetUser: false});
        try {
            const url = '/api/user';
            const { data } = await clienteAxios(url);

            const result = UserSchema.safeParse(data.data);
            if(result.success){
                set({ AuthUser: result.data, loadingGetUser: false });
            }
        } catch (error) {
            set({getUserByTokenError: true, loadingGetUser: false});
            throw error;
        }
    },
    getUserRoleByToken: async () => {
        set({loadingGetRole: true, userRole: ''});
        try {
            const url = '/api/roles/user';
            const { data } = await clienteAxios(url);

            const result = userRoleSchema.safeParse(data);
            if(result.success){
                set({ userRole: result.data.name, loadingGetRole: false });
            }
        } catch (error) {
            set({ loadingGetRole: false, errorgetRole: true });
            throw error;
        }
    }

})