import clienteAxios from "@/config/axios";
import { DraftRole, Role } from "@/types";
import { RolesSchema } from "@/utils/roles-schema";

export async function getRoles(): Promise<Role[]> {
    try {
        const url = '/api/roles';
        const { data } = await clienteAxios(url);
        const result = RolesSchema.safeParse(data)
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        throw error;
    }
}

export async function createRole(rol : DraftRole): Promise<string[] | void> {
    try {
        const url = '/api/roles';
        await clienteAxios.post(url, rol);
    } catch (error: any) {
        if (error.response?.data?.errors) {
            return Object.values(error.response.data.errors);
        }
        return ["Error desconocido"];
    }
}