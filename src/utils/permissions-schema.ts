import { z } from 'zod';

export const PermissionAPIResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});


export const PermissionsAPIResponseSchema = z.object({
    data: z.array(PermissionAPIResponseSchema)
})