import clienteAxios from "@/config/axios";
import { z } from "zod";

export const BasketSchema = z.object({
    id: z.string(),
    code: z.string(),
    weight: z.number()
});

export const BasketsSchema = z.object({
    data: z.array(BasketSchema)
});

export type Basket = z.infer<typeof BasketSchema>;

export async function getBaskets(): Promise<Basket[]> {
    try {
        const url = '/api/baskets';
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