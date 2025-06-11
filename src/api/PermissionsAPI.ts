import { PermissionsSchema, PermissionsUserSchema } from "@/utils/permissionsSchemas";
import { isAxiosError } from "axios";
import { DraftPermiso } from "types/permissionsType";
import clienteAxios from "@/config/axios";

export async function createPermission(permission: DraftPermiso) {
    try {
        const url = '/api/permissions';
        const { data } = await clienteAxios.post<string>(url, permission);
        return data;
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function getPermissions({ paginated, currentPage }: { paginated: string, currentPage: number }) {
    try {
        const url = `/api/permissions?paginated=${paginated}&page=${currentPage}`;
        const { data } = await clienteAxios(url);
        const result = PermissionsSchema.safeParse(data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        throw error;
    }
}

export async function getPermissionsByUser() {
    try {
        const url = '/api/permissions/user';
        const { data } = await clienteAxios(url);
        const result = PermissionsUserSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}
