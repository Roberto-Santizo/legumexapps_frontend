import { z } from 'zod'

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string() || z.null(),
    username: z.string(),
    status: z.number(),
    roles: z.string(),
});

export const DraftUserSchema = z.object({
    name: z.string(),
    email: z.string() || z.null(),
    username: z.string(),
    status: z.number(),
    roles: z.string(),
    password: z.string(),
    permissions: z.array(z.object({
        id: z.number(),
        name: z.string(),
    }))
});

export const UserDetailsSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string() || z.null(),
    username: z.string(),
    status: z.boolean(),
    roles: z.string(),
    permissions: z.array(z.object({
        id: z.number(),
        name: z.string(),
    }))
});

export const UsersSchema = z.object({
    data: z.array(UserSchema)
})

