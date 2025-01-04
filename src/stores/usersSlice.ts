import { StateCreator } from "zustand"
import { DraftUser, User } from "../types"
import { createUser, getUsers } from "../services/UsersServices"

export type UsersSliceType = {
    users: User[],
    loading: boolean,
    error: boolean,
    fetchUsers: () => Promise<void>,
    createUser: (user: DraftUser) => Promise<void>
   
}


export const createUsersSlice : StateCreator<UsersSliceType> = (set) => ({
    users: [],
    loading: false,
    error:false,
    fetchUsers: async () => {
        set({ loading: true })
        try {
            const response = await getUsers()
            set({
                users: response?.data,
                loading: false,
                error: false
            })
        } catch (error) {
            set({ error: true, loading: false })
        }
        
    },
    createUser: async(user) => {
        const response = await createUser(user);
    }
    
})