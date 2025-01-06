import {z} from 'zod';
import { UserAPIResponseSchema,UserAuthAPIResponseSchema } from '../utils/users-schema';
import { RoleAPIResponseSchema } from '../utils/roles-schema';
import { PermissionAPIResponseSchema } from '../utils/permissions-schema';

export type User = z.infer<typeof UserAPIResponseSchema>;
export type UserCreated = z.infer<typeof UserAuthAPIResponseSchema>;
export type Permission = z.infer<typeof PermissionAPIResponseSchema>;
export type DraftPermssion = Omit<PermissionState, 'id'>;
export type Role = z.infer<typeof RoleAPIResponseSchema>;
export type DraftRole = Omit<Role, 'id'>;
export type DraftUser = Omit<UserCreated, 'id'>;
export type AuthAPIUser = z.infer<typeof UserAuthAPIResponseSchema>;
export type AuthUser = {
    username: string,
    password: string,
}