import { StateCreator } from "zustand"
import { DraftUser, User } from "../types"
import { getUsers } from "../services/UsersServices"
import clienteAxios from "../config/axios"

export type UsersSliceType = {
    users: User[],
    loadingUser: boolean,
    UserError: boolean,
    usersErrors: string[],
    fetchUsers: () => Promise<void>,
    createUser: (user: DraftUser) => Promise<void>

}


export const createUsersSlice: StateCreator<UsersSliceType> = (set) => ({
    users: [],
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
    }

})