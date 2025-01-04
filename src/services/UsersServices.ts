import { UsersAPIResponseSchema } from '../utils/users-schema';
import clienteAxios from '../config/axios';

export async function getUsers() {
    try {
        const url = 'http://127.0.0.1:8000/api/users';
        const { data } = await clienteAxios(url,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
            }
        })
        const result = UsersAPIResponseSchema.safeParse(data)
        if (result.success) {
            return result.data
        }
    } catch (error) {
        throw error;
    }

}