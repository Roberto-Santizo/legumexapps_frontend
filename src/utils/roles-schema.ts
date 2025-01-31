import { z } from 'zod';

export const Role = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});

export const userRoleSchema = z.object({
    name: z.string()
});

export const RolesSchema = z.object({
    data: z.array(Role)
})

