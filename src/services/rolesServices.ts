import clienteAxios from '../config/axios';
import { Roles } from '../utils/roles-schema';

export async function getRoles() {
    try {
        const url = '/api/roles';
        const { data } = await clienteAxios(url,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
            }
        })
        const result = Roles.safeParse(data)
        if (result.success) {
            return result.data
        }
    } catch (error) {
        throw error;
    }
}
