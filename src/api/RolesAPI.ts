import clienteAxios from "@/config/axios";
import { rolesSchema } from "@/utils/rolesSchemas";
import { isAxiosError } from "axios";
import { DraftRole } from "types/rolesTypes";

export async function getRoles({ paginated, currentPage }: { paginated: string, currentPage: number }) {
    try {
        const url = `/api/roles?paginated=${paginated}&page=${currentPage}`;
        const { data } = await clienteAxios(url);
        const result = rolesSchema.safeParse(data)
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        throw error;
    }
}

export async function createRole(rol: DraftRole) {
    try {
        const url = '/api/roles';
        const { data } = await clienteAxios.post<string>(url, rol);
        return data;
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}