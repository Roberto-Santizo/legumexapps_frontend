import clienteAxios from "@/config/axios";
import { userRoleSchema } from "@/utils/roles-schema";
import { isAxiosError } from "axios";

export async function getUserRoleByToken() {
    try {
        const url = '/api/roles/user';
        const { data } = await clienteAxios(url);

        const result = userRoleSchema.safeParse(data);
        if (result.success) {
            return result.data.name
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
    }
}