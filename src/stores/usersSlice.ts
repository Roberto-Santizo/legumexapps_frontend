import { StateCreator } from "zustand"
import { User } from "../types"
import { getUsers } from "../services/UsersServices"

export type UsersSliceType = {
    users: User[],
    loading: boolean,
    fetchUsers: () => Promise<void>
   
}


export const createUsersSlice : StateCreator<UsersSliceType> = (set) => ({
    users: [],
    loading: false,
    fetchUsers: async () => {
        set({ loading: true })
        const response = await getUsers()
        set({
            users: response?.users || [],
            loading: false
        })
    },
    
})