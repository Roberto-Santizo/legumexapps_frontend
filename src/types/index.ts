import { z } from 'zod';
import { DraftUserSchema, UserDetailsSchema, UserSchema, UsersSchema } from '../utils/users-schema';
import { Role } from '../utils/roles-schema';
import { Permission } from '../utils/permissions-schema';
import { TareaSchema, TareasSchema } from '../utils/tareas-schema';
import { Crop, DraftCDP, Plantation, PlantationsPaginateSchema, PlantationsSchema, Recipe } from '../utils/plantation-schema';
import { DraftLote, Lote, LotesSchema } from '../utils/lotes-schema';
import { Finca } from '../utils/fincas-schema';
import { SummaryWeeklyPlan, WeeklyPlan, WeeklyPlansSchema } from '../utils/weekly_plans-schema';
import { EditTaskWeeklySchema, TasksWeeklyPlanSchema, TaskWeeklyPlanDetailsSchema, TaskWeeklyPlanSchema } from '../utils/taskWeeklyPlan-schema';
import { EmployeeSchema } from '../utils/employee-schema';
import { EmployeesTaskCropPlanSchema, EmployeeTaskCropPlanSchema, TaskCropIncompleteSchema, TaskCropWeeklyPlanDetailSchema } from '../utils/taskCropWeeklyPlan-schema';
import { TaskCropWeeklyPlanSchema, TasksCropWeeklyPlanSchema } from "../utils/taskCropWeeklyPlan-schema";


//PERMISOS
export type Permission = z.infer<typeof Permission>;
export type DraftPermssion = Omit<Permission, 'id' | 'created_at' | 'updated_at'>;

//ROLES
export type Role = z.infer<typeof Role>;
export type DraftRole = Omit<Role, 'id'>;

//USUARIOS
export type User = z.infer<typeof UserSchema>;
export type Users = z.infer<typeof UsersSchema>;
export type DraftUser = z.infer<typeof DraftUserSchema>;
export type UserDetail = z.infer<typeof UserDetailsSchema>;

// export type UserCollection = z.infer<typeof UserCollectionSchema>;


export type AuthUser = {
    username: string,
    password: string,
}

//TAREAS
export type Tarea = z.infer<typeof TareaSchema>
export type Tareas = z.infer<typeof TareasSchema>


export type DraftTarea = Omit<Tarea, 'id' >

//CULTIVOS
export type Crop = z.infer<typeof Crop>

//CPDS
export type Recipe = z.infer<typeof Recipe >;

export type Plantation = z.infer<typeof Plantation>;
export type Plantations = z.infer<typeof PlantationsSchema>
export type PlantationsPaginate = z.infer<typeof PlantationsPaginateSchema>;


export type DraftCDP = z.infer<typeof DraftCDP>;


//LOTES
export type Lote = z.infer<typeof Lote >
export type Lotes = z.infer<typeof LotesSchema>

export type DraftLote = z.infer<typeof DraftLote>

//FINCAS
export type Finca = z.infer<typeof Finca >

//PLANES
export type WeeklyPlan = z.infer<typeof WeeklyPlan>
export type WeeklyPlans = z.infer<typeof WeeklyPlansSchema>
export type SummaryWeeklyPlanType = z.infer<typeof SummaryWeeklyPlan>

//TAREA LOTE
export type TaskWeeklyPlan = z.infer<typeof TaskWeeklyPlanSchema>
export type DraftTaskWeeklyPlan = z.infer<typeof EditTaskWeeklySchema>
export type TasksWeeklyPlan = z.infer<typeof TasksWeeklyPlanSchema>
export type TaskWeeklyPlanDetails = z.infer<typeof TaskWeeklyPlanDetailsSchema>

//TAREA COSECHA LOTE
export type TasksCropWeeklyPlan = z.infer<typeof TasksCropWeeklyPlanSchema>
export type TaskCropIncomplete = z.infer<typeof TaskCropIncompleteSchema>
export type TaskCropWeeklyPlan = z.infer<typeof TaskCropWeeklyPlanSchema>
export type TaskCropWeeklyPlanDetail = z.infer<typeof TaskCropWeeklyPlanDetailSchema>

//EMPLEADOS
export type Employee = z.infer<typeof EmployeeSchema>;
export type EmployeesCrop = z.infer<typeof EmployeesTaskCropPlanSchema>
export type EmployeeCrop = z.infer<typeof EmployeeTaskCropPlanSchema>