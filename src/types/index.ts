import {z} from 'zod';
import { PermissionAPIResponseSchema, UserAPIResponseSchema, RoleAPIResponseSchema,UserAuthAPIResponseSchema } from '../utils/users-schema';

export type User = z.infer<typeof UserAPIResponseSchema>;
export type UserCreated = z.infer<typeof UserAuthAPIResponseSchema>;
export type Permission = z.infer<typeof PermissionAPIResponseSchema>;
export type Role = z.infer<typeof RoleAPIResponseSchema>;
export type DraftUser = Omit<UserCreated, 'id'>;
export type AuthAPIUser = z.infer<typeof UserAuthAPIResponseSchema>;
export type AuthUser = {
    username: string,
    password: string,
}