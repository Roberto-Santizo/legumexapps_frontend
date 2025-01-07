import { z } from 'zod'

export const UserAuthAPIResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string() || z.null(),
    username: z.string(),
    status: z.number(),
    password: z.string(),
    roles: z.string(),
    permissions: z.array(z.object({
        id: z.number(),
        name: z.string(),
    }))
});

export const User = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string() || z.null(),
    username: z.string(),
    status: z.number(),
    roles: z.string(),
    permissions: z.array(z.object({
        id: z.number(),
        name: z.string(),
    }))
})

export const Users = z.object({
    data: z.array(User)
})

