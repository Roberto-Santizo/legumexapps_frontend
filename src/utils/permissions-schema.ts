import { z } from 'zod';

export const Permission = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});


export const PermissionsSchema = z.object({
    data: z.array(Permission)
})