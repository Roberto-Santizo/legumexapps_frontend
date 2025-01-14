import clienteAxios from '../config/axios';
import { Permissions } from '../utils/permissions-schema';

export async function getPermissions() {
    try {
        const url = '/api/permissions';
        const { data } = await clienteAxios(url,{
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('AUTH_TOKEN')}`
            }
        })
        const result = Permissions.safeParse(data);
        if (result.success) {
            return result.data
        }
    } catch (error) {
        throw error;
    }
}
