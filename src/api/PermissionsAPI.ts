import clienteAxios from "@/config/axios";
import { DraftPermssion, Permission } from "@/types";
import { PermissionsSchema } from "@/utils/permissions-schema";

export async function getPermissions(): Promise<Permission[]> {
    try {
        const url = '/api/permissions';
        const { data } = await clienteAxios(url);
        const result = PermissionsSchema.safeParse(data);
        if (result.success) {
            return result.data.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        throw error;
    }
}

export async function createPermission(permission: DraftPermssion): Promise<void | string[]> {
    try {
        const url = '/api/permissions';
        await clienteAxios.post(url, permission);
    } catch (error: any) {
        if (error.response?.data?.errors) {
            return Object.values(error.response.data.errors);
        }
        return ["Error desconocido"];
    }
}