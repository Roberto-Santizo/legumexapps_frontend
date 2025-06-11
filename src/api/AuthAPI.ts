import { LoginType } from "@/views/auth/Login";
import { isAxiosError } from "axios";
import { authenticatedUser } from "@/utils/authSchemas";
import clienteAxios from "@/config/axios";

export async function login(FormData: LoginType) {
    try {
        const url = '/api/login';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else if (error.response?.data.msg) {
                throw new Error(error.response?.data.message);
            }
        }
        throw new Error("Error desconocido al iniciar sesión");
    }
}

export async function logout() {
    try {
        const url = '/api/logout';
        const { data } = await clienteAxios.post<string>(url, null);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function getUser() {
    try {
        const { data } = await clienteAxios('/api/user');
        const result = authenticatedUser.safeParse(data);
        if (result.success) {
            return result.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}
