import { UsersAPIResponseSchema } from '../utils/users-schema';
import clienteAxios from '../config/axios';
import { DraftUser } from '../types';

export async function getUsers() {
    try {
        const url = 'http://127.0.0.1:8000/api/users';
        const { data } = await clienteAxios(url)
        const result = UsersAPIResponseSchema.safeParse(data)
        if (result.success) {
            return result.data
        }
    } catch (error) {
        throw error;
    }

}

export async function createUser(User: DraftUser) {
    const url = 'http://127.0.0.1:8000/api/users';
    const { data } = await clienteAxios.post(url, User);
    console.log(data);
    // const result = UsersAPIResponseSchema.safeParse(data)
    // if(result.success) {
    //     return result.data
    // }
}