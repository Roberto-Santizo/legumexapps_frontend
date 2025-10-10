import { usersSchema, userSchema } from "@/utils/usersSchemas";
import { isAxiosError } from "axios";
import { DraftUser, User } from "@/types/usersTypes";
import clienteAxios from "@/config/axios";


export async function createUser(user: DraftUser) {
    try {
        const url = `/api/users`;
        const { data } = await clienteAxios.post<string>(url, user);
        return data;
    } catch (error: any) {
        if (isAxiosError(error)) {
            if (error.response?.data.msg) {
                throw new Error(error.response?.data.msg);
            } else if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            }
        }
    }
}

export async function getUsers({ paginated, currentPage }: { paginated: string, currentPage: number }) {
    try {
        const url = `/api/users?paginated=${paginated}&page=${currentPage}`;
        const { data } = await clienteAxios(url);
        const result = usersSchema.safeParse(data);
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
            if (error.response?.data.msg) {
                throw new Error(error.response?.data.msg);
            } else if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            }
        }
    }
}

export async function getUserById(id: User['id']) {
    const url = `/api/users/${id}`;
    try {
        const { data } = await clienteAxios(url);
        const result = userSchema.safeParse(data.data);
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
