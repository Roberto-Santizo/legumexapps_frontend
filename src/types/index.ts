import {z} from 'zod';
import { UserCollectionSchema, UserSchema, } from '../utils/users-schema';
import { Role } from '../utils/roles-schema';
import { Permission } from '../utils/permissions-schema';
import { Tarea } from '../utils/tareas-schema';
import { Crop, DraftCDP, Plantation, Recipe } from '../utils/plantation-schema';
import { DraftLote, Lote } from '../utils/lotes-schema';
import { Finca } from '../utils/fincas-schema';
import { SummaryWeeklyPlan, WeeklyPlan } from '../utils/weekly_plans-schema';
import { TasksWeeklyPlanSchema, TaskWeeklyPlanDetailsSchema, TaskWeeklyPlanSchema } from '../utils/taskWeeklyPlan-schema';
import { EmployeeSchema } from '../utils/employee-schema';

//PERMISOS
export type Permission = z.infer<typeof Permission>;
export type DraftPermssion = Omit<Permission, 'id' | 'created_at' | 'updated_at'>;

//ROLES
export type Role = z.infer<typeof Role>;
export type DraftRole = Omit<Role, 'id'>;

//USUARIOS
export type User = z.infer<typeof UserSchema>;
export type UserCreated = z.infer<typeof UserCollectionSchema>;
export type DraftUser = Omit<UserCreated, 'id'>;


export type UserCollection = z.infer<typeof UserCollectionSchema>;


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

//PLANES
export type WeeklyPlan = z.infer<typeof WeeklyPlan>
export type SummaryWeeklyPlanType = z.infer<typeof SummaryWeeklyPlan>

//TAREA LOTE
export type TaskWeeklyPlan = z.infer<typeof TaskWeeklyPlanSchema>
export type TasksWeeklyPlan = z.infer<typeof TasksWeeklyPlanSchema>
export type TaskWeeklyPlanDetails = z.infer<typeof TaskWeeklyPlanDetailsSchema>

//EMPLEADOS
export type Employee = z.infer<typeof EmployeeSchema>;