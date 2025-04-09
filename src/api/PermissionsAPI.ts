import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { DraftPermiso } from "views/admin/permisos/CreatePermiso";
import { z } from "zod";

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

export const PermissionSchema = z.object({
    id: z.number(),
    name: z.string(),
});


export const PermissionsSchema = z.object({
    data: z.array(PermissionSchema)
})

export type Permission = z.infer<typeof PermissionSchema>;

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

export const PermissionsUserSchema = z.object({
    data: z.array(z.object({
        name: z.string()
    }))
});

export async function getPermissionsByUser() {
    try {
        const url = '/api/permissions/user';
        const { data } = await clienteAxios(url);
        const result = PermissionsUserSchema.safeParse(data);
        if(result.success){
            return result.data.data
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}
