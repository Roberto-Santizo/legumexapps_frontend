import { z } from 'zod';

export const RoleAPIResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const RolesAPIResponseSchema = z.object({
    data: z.array(RoleAPIResponseSchema)
})