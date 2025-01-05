import { StateCreator } from "zustand"
import { Permission } from "../types"
import { getPermissions } from "../services/permissionsServices"

export type PermissionsSliceType = {
    permissions: Permission[],
    fetchPermissions: () => Promise<void>,

}


export const createPermissionsSlice: StateCreator<PermissionsSliceType> = (set) => ({
    permissions: [],
    fetchPermissions: async () => {
        try {
            const response = await getPermissions();
            set({
                permissions: response?.data,
            })
        } catch (error) {
            console.log(error);
        }
        
        
    },
})