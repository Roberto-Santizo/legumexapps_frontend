import { ApiResponseSchema } from "@/schemas/httpRequestsSchemas";
import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";

export async function createPlan(file: File) {
    try {
        const url = '/api/seeding-plan';
        const formData = new FormData();
        formData.append('file', file);
        const response = await clienteAxios.post(url, formData);
        const result = ApiResponseSchema.safeParse(response.data);

        if (result.success) {
            return result.data.message;
        } else {
            throw new Error('Hubo un error');
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Error no controlado");
    }
}