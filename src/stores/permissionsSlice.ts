import { StateCreator } from "zustand"
import { DraftPermssion, Permission } from "../types"
import { getPermissions } from "../services/permissionsServices"
import clienteAxios from "../config/axios"

export type PermissionsSliceType = {
    permissions: Permission[],
    loadingPermissions: boolean,
    permissionError: boolean,
    permissionsErrors: string[],
    fetchPermissions: () => Promise<void>,
    createPermission: (permisson: DraftPermssion) => Promise<void>

}

export const createPermissionsSlice: StateCreator<PermissionsSliceType> = (set) => ({
    permissions: [],
    loadingPermissions: false,
    permissionError: false,
    permissionsErrors: [],
    fetchPermissions: async () => {
        try {
            set({ loadingPermissions: true });
            const response = await getPermissions();
            set({
                permissions: response?.data,
                loadingPermissions: false,
                permissionError: false
            })
        } catch (error) {
            set({ permissionError: true, loadingPermissions: false });
        }
    },
    createPermission: async (permission) => {
        try {
            set({ loadingPermissions: true });
            const url = 'http://127.0.0.1:8000/api/permissions';
            await clienteAxios.post(url, permission, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            });
            set({ loadingPermissions: false, permissionsErrors: [] });
        } catch (error: any) {
            set({ loadingPermissions: false, permissionsErrors: Object.values(error.response.data.errors) })
            throw error;
        }
    }
})