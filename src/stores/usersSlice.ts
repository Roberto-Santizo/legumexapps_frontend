import { StateCreator } from "zustand"
import { DraftUser, User } from "../types"
import { getUsers } from "../services/UsersServices"
import clienteAxios from "../config/axios"
import { UserAPIResponseSchema } from "../utils/users-schema"

export type UsersSliceType = {
    users: User[],
    userEditing: User,
    loadingUser: boolean,
    UserError: boolean,
    usersErrors: string[],
    fetchUsers: () => Promise<void>,
    createUser: (user: DraftUser) => Promise<void>,
    getUser: (id: User['id']) => Promise<void>

}


export const createUsersSlice: StateCreator<UsersSliceType> = (set) => ({
    users: [],
    userEditing: {} as User,
    loadingUser: false,
    usersErrors: [],
    UserError: false,
    fetchUsers: async () => {
        set({ loadingUser: true })
        try {
            const response = await getUsers()
            set({
                users: response?.data,
                loadingUser: false,
                UserError: false
            })
        } catch (error) {
            set({ UserError: true, loadingUser: false })
        }

    },
    createUser: async (user) => {
        const url = 'http://127.0.0.1:8000/api/users';
        set({ loadingUser: true });
        try {
            await clienteAxios.post(url, user, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            });
            
            set({ loadingUser: false, usersErrors: [], UserError: false });
        } catch (error: any) {
            set({ usersErrors: Object.values(error.response.data.errors), UserError: true, loadingUser: false });
            throw error;
        }
    },
    getUser: async (id) => {
        set({ loadingUser: true });
        const url = `http://127.0.0.1:8000/api/users/${id}`;
        try {
            const {data} = await clienteAxios(url, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            });
            
            const result = UserAPIResponseSchema.safeParse(data.data);

            if(result.success){
                set({ loadingUser: false, usersErrors: [], UserError: false, userEditing: result.data});
            }
        } catch (error: any) {
            set({ usersErrors: Object.values(error.response.data.errors), UserError: true, loadingUser: false });
            throw error;
        }
    },
   

})