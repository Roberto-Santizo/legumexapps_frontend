import clienteAxios from "@/config/axios";
import { Basket } from "@/types";
import { BasketsSchema } from "@/utils/baskets-schema";

export async function getAllBaskets(): Promise<Basket[]> {
    try {
        const url = '/api/baskets-all';
        const { data } = await clienteAxios(url);
        const result = BasketsSchema.safeParse(data);
        if (result.success) {
            return result.data.data;
        } else {
            throw new Error('información no válida');
        }
    } catch (error) {
        throw error;
    }
}