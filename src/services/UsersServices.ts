import { Users } from '../utils/users-schema';
import clienteAxios from '../config/axios';

export async function getUsers() {
    try {
        const url = `/api/users`;
        const { data } = await clienteAxios(url,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
            }
        })
        const result =  Users.safeParse(data)
        if (result.success) {
            return result.data
        }
    } catch (error) {
        throw error;
    }

}