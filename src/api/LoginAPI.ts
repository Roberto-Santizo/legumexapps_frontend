import clienteAxios from "@/config/axios";
import { userRoleSchema } from "@/utils/rolesSchemas";
import { isAxiosError } from "axios";

export async function getUserRoleByToken() {
    try {
        const url = '/api/roles/user';
        const { data } = await clienteAxios(url);

        const result = userRoleSchema.safeParse(data);
        if (result.success) {
            return result.data.name
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
    }
}