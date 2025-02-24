import {  z } from 'zod';

export const Plantation = z.object({
    crop: z.string(),
    id: z.string(),
    name: z.string(),
    recipe: z.string(),
    density: z.number(),
    start_date: z.string(),
    end_date: z.union([z.string(), z.null()]),
    size: z.string(),
    aplication_week: z.number(),
    status: z.boolean()

});

export const CDPSchema = z.object({
    id: z.string(),
    cdp: z.string()
});

export const CDPsSchema = z.object({
    data: z.array(CDPSchema)
});

export const DraftCDP = z.object({
    crop_id: z.string(),
    id: z.string(),
    name: z.string(),
    recipe_id: z.string(),
    density: z.number(),
    start_date: z.string(),
    end_date: z.union([z.string(), z.null()]),
    size: z.string()
});


export const Recipe = z.object({
    id: z.string(),
    name: z.string()
});

export const Crop = z.object({
    id: z.string(),
    name: z.string(),
    variety: z.string()
});

export const Recipes = z.object({
    data: z.array(Recipe)
});

export const CropsSchema = z.object({
    data: z.array(Crop)
});

export const PlantationsPaginateSchema = z.object({
    data: z.array(Plantation),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export const PlantationsSchema = z.object({
    data: z.array(Plantation),
});



