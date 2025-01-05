import clienteAxios from '../config/axios';
import { PermissionsAPIResponseSchema } from '../utils/permissions-schema';

export async function getPermissions() {
    try {
        const url = 'http://127.0.0.1:8000/api/permissions';
        const { data } = await clienteAxios(url,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
            }
        })
        const result = PermissionsAPIResponseSchema.safeParse(data);
        if (result.success) {
            return result.data
        }
    } catch (error) {
        throw error;
    }
}
