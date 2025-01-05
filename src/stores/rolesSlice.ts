import { StateCreator } from "zustand"
import { Role } from "../types"
import { getRoles } from "../services/rolesServices"

export type RolesSliceType = {
    roles: Role[],
    loadingRoles: boolean,
    rolesError: boolean,
    rolesErrors: string[],
    fetchRoles: () => Promise<void>,

}


export const createRolesSlice: StateCreator<RolesSliceType> = (set) => ({
    roles: [],
    loadingRoles: false,
    rolesErrors: [],
    rolesError: false,
    fetchRoles: async () => {
        try {
            const response = await getRoles();
            set({
                roles: response?.data,
                loadingRoles: false,
                rolesError: false
            })
        } catch (error) {
            console.log(error);
        }
        
        
    },
})