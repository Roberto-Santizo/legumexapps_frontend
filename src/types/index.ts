import {z} from 'zod';
import { User,UserAuthAPIResponseSchema } from '../utils/users-schema';
import { Role } from '../utils/roles-schema';
import { Permission } from '../utils/permissions-schema';
import { Tarea } from '../utils/tareas-schema';
import { Crop, DraftCDP, Plantation, Recipe } from '../utils/plantation-schema';
import { DraftLote, Lote } from '../utils/lotes-schema';
import { Finca } from '../utils/fincas-schema';

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
export type Recipe = z.infer<typeof Recipe >;

export type Plantation = z.infer<typeof Plantation>;
export type DraftCDP = z.infer<typeof DraftCDP>;


//LOTES
export type Lote = z.infer<typeof Lote >
export type DraftLote = z.infer<typeof DraftLote>

//FINCAS
export type Finca = z.infer<typeof Finca >