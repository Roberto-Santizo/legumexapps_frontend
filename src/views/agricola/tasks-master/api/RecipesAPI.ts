import clienteAxios from "@/config/axios";
import { RecipesSchema } from "../schemas";
import { isAxiosError } from "axios";
import { DraftRecipe } from "../types";
import { ApiResponseSchema } from "@/schemas/httpRequestsSchemas";

export async function getRecipes() {
    try {
        const url = '/api/recipes';
        const response = await clienteAxios(url);

        const result = RecipesSchema.safeParse(response.data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error("Hubo un error");
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
    }
}


export async function createRecipe(data: DraftRecipe) {
    try {
        const url = '/api/recipes';
        const response = await clienteAxios.post(url, data);

        const result = ApiResponseSchema.safeParse(response.data);

        if (result.success) {
            return result.data.message;
        } else {
            throw new Error("Hubo un error");
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.message);
        }
    }
}