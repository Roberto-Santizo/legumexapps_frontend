import { StateCreator } from "zustand"
import { Permission } from "../types"
import { getPermissions } from "../services/permissionsServices"

export type PermissionsSliceType = {
    permissions: Permission[],
    loadingPermissions: boolean,
    permissionError: boolean,
    permissionsErrors: [],
    fetchPermissions: () => Promise<void>,

}

export const createPermissionsSlice: StateCreator<PermissionsSliceType> = (set) => ({
    permissions: [],
    loadingPermissions: false,
    permissionError: false,
    permissionsErrors: [],
    fetchPermissions: async () => {
        try {
            set({loadingPermissions: true});
            const response = await getPermissions();
            set({
                permissions: response?.data,
                loadingPermissions:false,
                permissionError: false
            })
        } catch (error) {
            set({permissionError: true, loadingPermissions:false});
        }
    },
})