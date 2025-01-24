import { StateCreator } from "zustand"
import { DraftUser, User, UserCollection } from "../types"
import clienteAxios from "../config/axios"
import { UsersSchema, UserSchema, UsersCollectionSchema } from "../utils/users-schema"

export type UsersSliceType = {
    users: UserCollection[],
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
            const url = `/api/users`;
            const { data } = await clienteAxios(url)
            const result =  UsersCollectionSchema.safeParse(data)
            if (result.success) {
                set({users: result.data.data, loadingUser: false, usersErrors: [], UserError: false });
            }
        } catch (error) {
            throw error;
        }

    },
    createUser: async (user) => {
        const url = `/api/users`;
        set({ loadingUser: true });
        try {
            await clienteAxios.post(url, user);

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
            const { data } = await clienteAxios.put(url, user);

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
                }
            );

            const result = UsersSchema.safeParse(data);

            if (result.success) {
                set({ loadingChangeStatus: false, usersErrors: [], UserError: false, users: data.data, updatingId: '' });
            }
        } catch (error: any) {
            set({ usersErrors: Object.values(error.response.data.errors), UserError: true, loadingUser: false });
            throw error;
        }
    }


})