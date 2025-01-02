import {z} from 'zod';
import { PermissionAPIResponseSchema, UserAPIResponseSchema, RoleAPIResponseSchema } from '../utils/users-schema';

export type User = z.infer<typeof UserAPIResponseSchema>;
export type Permission = z.infer<typeof PermissionAPIResponseSchema>;
export type Role = z.infer<typeof RoleAPIResponseSchema>;
export type DraftUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;