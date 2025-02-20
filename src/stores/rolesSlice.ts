import { StateCreator } from "zustand"
import { DraftRole, Role } from "../types"
import clienteAxios from "../config/axios"
import { RolesSchema } from "../utils/roles-schema"

export type RolesSliceType = {
    rolesErrors: string[],
    fetchRoles: () => Promise<Role[]>,
    createRole: (rol: DraftRole) => Promise<void>
}


export const createRolesSlice: StateCreator<RolesSliceType> = (set) => ({
    roles: [],
    loadingRoles: false,
    rolesErrors: [],
    rolesError: false,
    fetchRoles: async () => {
        try {
            const url = '/api/roles';
            const { data } = await clienteAxios(url);
            const result = RolesSchema.safeParse(data)
            if (result.success) {
                return result.data.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            console.log(error);
            throw error;
        }


    },
    createRole: async (rol) => {
        try {
            const url = '/api/roles';
            await clienteAxios.post(url, rol);
            set({ rolesErrors: [] });
        } catch (error: any) {
            console.log(error);
            set({ rolesErrors: Object.values(error.response.data.errors)});
            throw error;
        }
    },
})