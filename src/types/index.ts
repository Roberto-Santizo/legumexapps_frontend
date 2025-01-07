import {z} from 'zod';
import { User,AuthUser } from '../utils/users-schema';
import { Role } from '../utils/roles-schema';
import { Permission } from '../utils/permissions-schema';

//PERMISOS
export type Permission = z.infer<typeof Permission>;
export type DraftPermssion = Omit<Permission, 'id' | 'created_at' | 'updated_at'>;

//ROLES
export type Role = z.infer<typeof Role>;
export type DraftRole = Omit<Role, 'id'>;

//USUARIOS
export type User = z.infer<typeof User>;
export type UserCreated = z.infer<typeof AuthUser>;
export type DraftUser = Omit<UserCreated, 'id'>;
export type AuthAPIUser = z.infer<typeof AuthUser>;
export type AuthUser = {
    username: string,
    password: string,
}