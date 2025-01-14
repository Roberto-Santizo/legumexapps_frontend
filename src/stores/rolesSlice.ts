import { StateCreator } from "zustand"
import { DraftRole, Role } from "../types"
import { getRoles } from "../services/rolesServices"
import clienteAxios from "../config/axios"

export type RolesSliceType = {
    roles: Role[],
    loadingRoles: boolean,
    rolesError: boolean,
    rolesErrors: string[],
    fetchRoles: () => Promise<void>,
    createRole: (rol : DraftRole) => Promise<void>
}


export const createRolesSlice: StateCreator<RolesSliceType> = (set) => ({
    roles: [],
    loadingRoles: false,
    rolesErrors: [],
    rolesError: false,
    fetchRoles: async () => {
        try {
            set({loadingRoles: true});
            const response = await getRoles();
            set({
                roles: response?.data,
                loadingRoles: false,
                rolesError: false
            })
            set({loadingRoles:false, rolesError:false});
        } catch (error) {
            console.log(error);
            set({loadingRoles:false, rolesError:true});
        }
        
        
    },
    createRole: async (rol) => {
        try {
            set({loadingRoles:true});
            const url = '/api/roles';
            await clienteAxios.post(url, rol, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
                }
            });
            set({ loadingRoles: false, rolesErrors: [], rolesError: false });
        } catch (error : any) {
            set({rolesErrors: Object.values(error.response.data.errors), rolesError:true ,loadingRoles:false});
            throw error;
        }
    },
})