import { z } from 'zod'

export const UserCollectionSchema = z.object({
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
});

export const UsersCollectionSchema = z.object({
    data: z.array(UserCollectionSchema)
})

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string() || z.null(),
    username: z.string(),
})

export const UsersSchema = z.object({
    data: z.array(UserSchema)
})

