import { z } from 'zod';

export const Permission = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});


export const Permissions = z.object({
    data: z.array(Permission)
})