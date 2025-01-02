import { z } from 'zod'

export const PermissionAPIResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
})

export const UserAPIResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    username: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    last_seen_version: z.string(),
    status: z.number(),
    // role: z.object({
    //     name: z.string()
    // }),
    // password: z.string(),
    // estado: z.string(),
    // created_at: z.string(),
    // updated_at: z.string(),
    // permissions: z.array(z.object({
    //     id: z.string(),
    //     name: z.string(),
    // }))
})

export const UsersAPIResponseSchema = z.object({
    users: z.array(UserAPIResponseSchema)
})

export const RoleAPIResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
});
