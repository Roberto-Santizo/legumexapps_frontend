import { z } from "zod";
import { DefectSchema } from "./defectos-schema";


export const DraftProductSchema = z.object({
    name: z.string(),
    variety_product_id: z.string(),
    accepted_percentage: z.string()
});

export const DetailProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    variety_product_id: z.string(),
    accepted_percentage: z.number(),
    defects: z.array(DefectSchema)

});

export const ProductSchema = z.object({
    id: z.string(),
    product: z.string(),
    variety: z.string(),
});

export const ProductsSchema = z.object({
    data:z.array(ProductSchema)
});

export const ProductsPaginateSchema = z.object({
    data: z.array(ProductSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});
