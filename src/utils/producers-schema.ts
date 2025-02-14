import { z } from "zod";


export const ProducerSchema = z.object({
    id: z.string(),
    code: z.number(),
    name: z.string()
}); 

export const ProducersSchema = z.object({
    data: z.array(ProducerSchema)
});

export const ProducersPaginateSchema = z.object({
    data: z.array(ProducerSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});
