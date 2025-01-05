import { z } from 'zod'

export const UserAuthAPIResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string() || z.null(),
    username: z.string(),
    status: z.number(),
    password: z.string(),
    roles: z.array(z.object({
        'id': z.number(),
        'name': z.string(),
    })),
    permissions: z.array(z.object({
        id: z.number(),
        name: z.string(),
    }))
});

export const UserAPIResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string() || z.null(),
    username: z.string(),
    status: z.number(),
    roles: z.array(z.object({
        'id': z.number(),
        'name': z.string(),
    })),
    permissions: z.array(z.object({
        id: z.number(),
        name: z.string(),
    }))
})

export const UsersAPIResponseSchema = z.object({
    data: z.array(UserAPIResponseSchema)
})

