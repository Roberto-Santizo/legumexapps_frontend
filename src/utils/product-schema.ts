import { z } from "zod";

export const ProductSchema = z.object({
    id: z.string(),
    product: z.string(),
    variety: z.string(),
});

export const ProductsSchema = z.object({
    data: z.array(ProductSchema)
});
