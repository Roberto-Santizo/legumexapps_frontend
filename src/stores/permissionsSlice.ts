import { StateCreator } from "zustand"
import { DraftPermssion, Permission } from "../types"
import clienteAxios from "../config/axios"
import { PermissionsSchema } from "../utils/permissions-schema"

export type PermissionsSliceType = {
    permissionsErrors: string[],
    fetchPermissions: () => Promise<Permission[]>,
    createPermission: (permisson: DraftPermssion) => Promise<void>
}

export const createPermissionsSlice: StateCreator<PermissionsSliceType> = (set) => ({
    permissionsErrors: [],

    fetchPermissions: async () => {
        try {
            const url = '/api/permissions';
            const { data } = await clienteAxios(url);
            const result = PermissionsSchema.safeParse(data);
            if(result.success){
                return result.data.data;
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },
    createPermission: async (permission) => {
        try {
            const url = '/api/permissions';
            await clienteAxios.post(url, permission);
            set({permissionsErrors: [] });
        } catch (error: any) {
            set({permissionsErrors: Object.values(error.response.data.errors) })
            throw error;
        }
    }
})