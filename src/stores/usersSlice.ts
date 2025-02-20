import { StateCreator } from "zustand"
import { DraftUser, User, UserDetail, Users } from "../types"
import clienteAxios from "../config/axios"
import { UsersSchema, UserDetailsSchema } from "../utils/users-schema"

export type UsersSliceType = {
    usersErrors: string[],
    fetchUsers: () => Promise<Users>,
    getUser: (id: User['id']) => Promise<UserDetail>,
    createUser: (user: DraftUser) => Promise<void>,
    updateUser: (id: User['id'], user: DraftUser) => Promise<void>
    changeActiveUser: (id: User['id']) => Promise<void>
}


export const createUsersSlice: StateCreator<UsersSliceType> = (set) => ({
    usersErrors: [],

    fetchUsers: async () => {
        try {
            const url = `/api/users`;
            const { data } = await clienteAxios(url);
            const result = UsersSchema.safeParse(data);
            if (result.success) {
                return result.data;
            } else {
                throw new Error("Información no válida");
            }
        } catch (error) {
            console.log(error);
            throw error;
        }

    },
    createUser: async (user) => {
        const url = `/api/users`;
        try {
            await clienteAxios.post(url, user);

        } catch (error: any) {
            console.log(error);
            throw error;
        }
    },
    getUser: async (id) => {
        const url = `/api/users-info/${id}/info`;
        try {
            const { data } = await clienteAxios(url);

            const result = UserDetailsSchema.safeParse(data.data);
            if (result.success) {
                return result.data;
            }else{
                throw new Error("Información no válida");
            }
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    },

    updateUser: async (id, user) => {
        const url = `/api/users/${id}`;
        try {
           await clienteAxios.put(url, user);
           set({usersErrors:[]});
        } catch (error: any) {
            console.log(error);
            set({usersErrors:Object.values(error.response.data.errors)});
            throw error;
        }
    },
    changeActiveUser: async (id) => {
        const url = `/api/users/${id}/status`;
        try {
            await clienteAxios.patch(url, { status: 1 });

        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }


})