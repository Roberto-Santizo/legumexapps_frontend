import { z } from 'zod'
import { EmployeeSchema } from '@/utils/employee-schema'
import { EmployeesTaskCropPlanSchema, EmployeeTaskCropPlanSchema, TaskCropIncompleteSchema, TaskCropSchema, TaskCropWeeklyPlanDetailSchema } from '@/utils/taskCropWeeklyPlan-schema'
import { TaskCropWeeklyPlanSchema, TasksCropWeeklyPlanSchema } from "../utils/taskCropWeeklyPlan-schema"
import { DefectsPaginateSchema } from '@/utils/defectos-schema'
import { DefectSchema } from '@/api/ProductsAPI'
import { TaskInsumoSchema } from '@/utils/taskWeeklyPlanSchemas'
import { DraftWeeklyPlanSchema, TaskPlantationControlSchema } from '@/schemas/plannerFincasSchemas'

export type TaskCrop = z.infer<typeof TaskCropSchema>

export type TasksCropWeeklyPlan = z.infer<typeof TasksCropWeeklyPlanSchema>
export type TaskCropIncomplete = z.infer<typeof TaskCropIncompleteSchema>
export type TaskCropWeeklyPlan = z.infer<typeof TaskCropWeeklyPlanSchema>
export type TaskCropWeeklyPlanDetail = z.infer<typeof TaskCropWeeklyPlanDetailSchema>

export type TaskInsumo = z.infer<typeof TaskInsumoSchema>

export type Employee = z.infer<typeof EmployeeSchema>
export type EmployeesCrop = z.infer<typeof EmployeesTaskCropPlanSchema>
export type EmployeeCrop = z.infer<typeof EmployeeTaskCropPlanSchema>


export type DefectsPaginate = z.infer<typeof DefectsPaginateSchema>
export type Defect = z.infer<typeof DefectSchema>

export type MaterialOutput = z.infer<typeof DefectSchema>

//PLANIFICADOR FINCAS
export type DraftWeeklyPlan = z.infer<typeof DraftWeeklyPlanSchema>;
export type TaskPlantationControl = z.infer<typeof TaskPlantationControlSchema>;
export type DraftTaskPlantationControl = Pick<TaskPlantationControl,'budget' | 'hours' | 'slots' | 'tags' | 'draft_weekly_plan_id'>;

//CHECKLIST LOTE
