import { z } from "zod";

export const CropSchema = z.object({
    id: z.string(),
    name: z.string(),
    variety: z.string()
});


export const CropsSchema = z.object({
    data: z.array(CropSchema)
})