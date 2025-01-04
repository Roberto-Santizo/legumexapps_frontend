import {z} from 'zod';
import { PermissionAPIResponseSchema, UserAPIResponseSchema, RoleAPIResponseSchema,UserAuthAPIResponseSchema } from '../utils/users-schema';

export type User = z.infer<typeof UserAPIResponseSchema>;
export type Permission = z.infer<typeof PermissionAPIResponseSchema>;
export type Role = z.infer<typeof RoleAPIResponseSchema>;
export type DraftUser = Omit<User, 'id'>;
export type AuthAPIUser = z.infer<typeof UserAuthAPIResponseSchema>;
export type AuthUser = {
    username: string,
    password: string,
}