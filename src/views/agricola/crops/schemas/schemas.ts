import { z } from "zod";

export const CropSchema = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string()
});

export const CropsResponseSchema = z.object({
    statusCode: z.number(),
    response: z.array(CropSchema)
});


export const CropPartSchema = z.object({
    id: z.number(),
    name: z.string()
});

export const CropPartResponseSchema = z.object({
    statusCode: z.number(),
    response: z.array(CropPartSchema)
});