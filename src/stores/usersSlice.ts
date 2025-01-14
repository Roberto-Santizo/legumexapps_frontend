import { StateCreator } from "zustand"
import { DraftUser, User } from "../types"
import { getUsers } from "../services/UsersServices"
import clienteAxios from "../config/axios"
import { Users, User as UserSchema } from "../utils/users-schema"

export type UsersSliceType = {
    users: User[],
    userEditing: User,
    loadingUser: boolean,
    UserError: boolean,
    loadingChangeStatus: boolean,
    usersErrors: string[],
    updatingId: string,
    fetchUsers: () => Promise<void>,
    createUser: (user: DraftUser) => Promise<void>,
    getUser: (id: User['id']) => Promise<void>,
    updateUser: (id: User['id'], user: DraftUser) => Promise<void>
    changeActiveUser: (id: User['id']) => Promise<void>

}


export const createUsersSlice: StateCreator<UsersSliceType> = (set) => ({
    users: [],
    userEditing: {} as User,
    loadingUser: false,
    loadingChangeStatus: false,
    usersErrors: [],
    UserError: false,
    updatingId: '',
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
        const url = `/api/users`;
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
        const url = `/api/users/${id}`;
        try {
            const { data } = await clienteAxios(url, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            });

            const result = UserSchema.safeParse(data.data);

            if (result.success) {
                set({ loadingUser: false, usersErrors: [], UserError: false, userEditing: result.data });
            }
        } catch (error: any) {
            set({ usersErrors: Object.values(error.response.data.errors), UserError: true, loadingUser: false });
            throw error;
        }
    },

    updateUser: async (id, user) => {
        set({ loadingUser: true });
        const url = `/api/users/${id}`;
        try {
            const { data } = await clienteAxios.put(url, user, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            });

            const result = UserSchema.safeParse(data.data);

            if (result.success) {
                set({ loadingUser: false, usersErrors: [], UserError: false, userEditing: {} as User });
            }
        } catch (error: any) {
            set({ usersErrors: Object.values(error.response.data.errors), UserError: true, loadingUser: false });
            throw error;
        }
    },
    changeActiveUser: async (id) => {
        set({ loadingChangeStatus: true, updatingId: id });
        const url = `/api/users/${id}/status`;
        try {
            const { data } = await clienteAxios.patch(
                url,
                { status: 1 },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`,
                    },
                }
            );

            const result = Users.safeParse(data);

            if (result.success) {
                set({ loadingChangeStatus: false, usersErrors: [], UserError: false, users: data.data, updatingId: '' });
            }
        } catch (error: any) {
            set({ usersErrors: Object.values(error.response.data.errors), UserError: true, loadingUser: false });
            throw error;
        }
    }


})