import {z} from 'zod';
import { User,UserAuthAPIResponseSchema } from '../utils/users-schema';
import { Role } from '../utils/roles-schema';
import { Permission } from '../utils/permissions-schema';
import { Tarea } from '../utils/tareas-schema';
import { Crop, Plantation } from '../utils/plantation-schema';

//PERMISOS
export type Permission = z.infer<typeof Permission>;
export type DraftPermssion = Omit<Permission, 'id' | 'created_at' | 'updated_at'>;

//ROLES
export type Role = z.infer<typeof Role>;
export type DraftRole = Omit<Role, 'id'>;

//USUARIOS
export type User = z.infer<typeof User>;
export type UserCreated = z.infer<typeof UserAuthAPIResponseSchema>;
export type DraftUser = Omit<UserCreated, 'id'>;
export type AuthAPIUser = z.infer<typeof UserAuthAPIResponseSchema>;
export type AuthUser = {
    username: string,
    password: string,
}

//TAREAS
export type Tarea = z.infer<typeof Tarea>
export type DraftTarea = Omit<Tarea, 'id' >

//CULTIVOS
export type Crop = z.infer<typeof Crop>

//CPDS
export type Plantation = z.infer<typeof Plantation>;