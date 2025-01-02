import { z } from 'zod'

export const PermissionAPIResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
})

export const UserAPIResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
    email: z.string(),
    role: z.object({
        name: z.string()
    }),
    password: z.string(),
    estado: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    permissions: z.array(z.object({
        id: z.string(),
        name: z.string(),
    }))
})

export const UsersAPIResponseSchema = z.object({
    data: z.array(UserAPIResponseSchema)
})

export const RoleAPIResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
});
