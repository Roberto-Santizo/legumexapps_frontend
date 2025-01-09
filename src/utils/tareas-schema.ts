import {z} from "zod";


export const Tarea = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    description: z.string(),
});

export const Tareas = z.object({
    data: z.array(Tarea)
})