import {z} from "zod";


export const TareaSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    description: z.string().nullable(),
});



export const TareasSchema = z.object({
    data: z.array(TareaSchema)
});