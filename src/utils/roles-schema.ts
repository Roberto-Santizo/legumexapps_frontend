import { z } from 'zod';

export const RoleAPIResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});

export const RolesAPIResponseSchema = z.object({
    data: z.array(RoleAPIResponseSchema)
})