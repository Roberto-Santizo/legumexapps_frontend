import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { DraftUser } from "views/admin/users/CreateUser";
import { z } from "zod";


export async function createUser(user: DraftUser) {
    try {
        const url = `/api/users`;
        const { data } = await clienteAxios.post<string>(url, user);
        return data;
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().nullable(),
    username: z.string(),
    status: z.number(),
    roles: z.string(),
});

export const UsersSchema = z.object({
    data: z.array(UserSchema),
});

export type User = z.infer<typeof UserSchema>


export async function getUsers(): Promise<User[]> {
    try {
        const url = `/api/users`;
        const { data } = await clienteAxios(url);
        const result = UsersSchema.safeParse(data);
        if (result.success) {
            return result.data.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function changeActiveUser(id: User['id']) {
    const url = `/api/user/${id}`;
    try {
        const { data } = await clienteAxios.patch<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else {
                throw new Error(error.response?.data.msg);

            }
        }
    }
}

export async function updateUser({ id, user }: { id: User['id'], user: DraftUser }) {
    const url = `/api/users/${id}`;
    try {
        const { data } = await clienteAxios.put<string>(url, user);
        return data;
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export const UserDetailsSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().nullable(),
    username: z.string(),
    status: z.boolean(),
    roles: z.string(),
    permissions: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
        })
    ),
});

export type UserDetail = z.infer<typeof UserDetailsSchema>

export async function getUserById(id: User['id']): Promise<UserDetail> {
    const url = `/api/user/${id}`;
    try {
        const { data } = await clienteAxios(url);
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
