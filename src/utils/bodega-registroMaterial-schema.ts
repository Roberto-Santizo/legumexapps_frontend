// Este codigo yo lo agregue Luis
import { z } from "zod";

export const MaterialRegisterSchema = z.object({
    name: z.string(),
    description: z.string(),
    code: z.string(),
    blocked: z.boolean(),
});

export const MaterialRegisterPaginateSchema = z.object({
    data: z.array(MaterialRegisterSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
})
