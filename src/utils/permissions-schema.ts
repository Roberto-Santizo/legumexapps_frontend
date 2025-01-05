import { z } from 'zod';

export const PermissionAPIResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const PermissionsAPIResponseSchema = z.object({
    data: z.array(PermissionAPIResponseSchema)
})