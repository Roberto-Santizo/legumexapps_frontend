import clienteAxios from "@/config/axios";

import { DraftUser, User, UserDetail, Users } from "@/types";
import { UserDetailsSchema, UsersSchema } from "@/utils/users-schema";


export async function createUser(user: DraftUser): Promise<void | string[]> {
    const url = `/api/users`;
    try {
        await clienteAxios.post(url, user);
    } catch (error: any) {
        if (error.response?.data?.errors) {
            return Object.values(error.response.data.errors);
        }
        return ["Error desconocido"];
    }
}

export async function getUsers(): Promise<Users> {
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
}

export async function changeActiveUser(id: User['id']) {
    const url = `/api/users/${id}/status`;
    try {
        await clienteAxios.patch(url, { status: 1 });
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export async function updateUser(id: User['id'], user: DraftUser): Promise<void | string[]> {
    const url = `/api/users/${id}`;
    try {
        await clienteAxios.put(url, user);
    } catch (error: any) {
        if (error.response?.data?.errors) {
            return Object.values(error.response.data.errors);
        }
        return ["Error desconocido"];
    }
}

export async function getUser(id: User['id']) : Promise<UserDetail>{
    const url = `/api/users-info/${id}/info`;
    try {
        const { data } = await clienteAxios(url);
        console.log(data);
        const result = UserDetailsSchema.safeParse(data.data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}
