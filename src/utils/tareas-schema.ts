import {z} from "zod";


export const TareaSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    description: z.string(),
});

export const TareasSchema = z.object({
    data: z.array(TareaSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
})