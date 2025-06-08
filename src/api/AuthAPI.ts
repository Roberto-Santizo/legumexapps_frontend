import clienteAxios from "@/config/axios";
import { LoginType } from "@/views/auth/Login";
import { isAxiosError } from "axios";
import z from "zod";

export const LogedInUser = z.object({
    name: z.string(),
    email: z.string().nullable(),
    username: z.string()
});

export const LoginSchema = z.object({
    token: z.string(),
    user: LogedInUser
});

export type LoginSuccessful = z.infer<typeof LoginSchema>;


export async function login(FormData: LoginType): Promise<LoginSuccessful> {
    try {
        const url = '/api/login';
        const { data } = await clienteAxios.post(url, FormData);
        const result = LoginSchema.safeParse(data);

        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no válida");
        }

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