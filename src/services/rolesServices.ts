import clienteAxios from '../config/axios';
import { RolesAPIResponseSchema } from '../utils/roles-schema';

export async function getRoles() {
    try {
        const url = 'http://127.0.0.1:8000/api/roles';
        const { data } = await clienteAxios(url,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
            }
        })
        const result = RolesAPIResponseSchema.safeParse(data)
        console.log(result);
        if (result.success) {
            return result.data
        }
    } catch (error) {
        throw error;
    }
}
