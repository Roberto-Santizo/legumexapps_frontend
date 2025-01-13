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

export const Crops = z.object({
    data: z.array(Crop)
});

export const Plantations = z.object({
    data: z.array(Plantation)
});


