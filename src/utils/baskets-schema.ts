import { z } from "zod";


export const BasketSchema = z.object({
    id: z.string(),
    code: z.string(),
    weight: z.number()
});

export const BasketsSchema = z.object({
    data: z.array(BasketSchema)
});