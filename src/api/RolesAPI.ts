import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { DraftRole } from "views/admin/roles/CreateRole";
import { z } from "zod";

export const RoleSchema = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});

export type Role = z.infer<typeof RoleSchema>

export const RolesSchema = z.object({
    data: z.array(RoleSchema)
})

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