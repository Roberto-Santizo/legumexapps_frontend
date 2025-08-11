import { z } from "zod";

export const StockKeepingUnitSchema = z.object({
    id: z.string(),
    code: z.string(),
    product_name: z.string(),
    presentation: z.string().nullable(),
    client_name: z.string()
});

export const SkusPaginatedSchema = z.object({
    data: z.array(StockKeepingUnitSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional()
});

export const ItemRecipeSchema = z.object({
    id: z.string(),
    product: z.string(),
    code: z.string()
});

export const SKUDetailsSchema = StockKeepingUnitSchema.pick({ id: true, client_name: true, code: true }).extend({
    packing_material_recipe: z.array(ItemRecipeSchema.extend({ lbs_per_item: z.number() })),
    raw_material_recipe: z.array(ItemRecipeSchema.extend({ percentage: z.number() }))
});

export const RawMaterialRecipeItemSchema = z.object({
    id: z.number(),
    percentage: z.number(),
    stock_keeping_unit_id: z.number(),
    raw_material_item_id: z.number()

});