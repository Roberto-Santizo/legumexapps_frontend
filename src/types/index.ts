import { z } from 'zod'
import { TareaSchema } from '@/utils/tareas-schema'
import { CDPSchema } from '@/utils/plantation-schema'
import { TaskInsumoSchema, TasksWeeklyPlanSchema, TaskWeeklyPlanDetailsSchema, TaskWeeklyPlanSchema } from '@/utils/taskWeeklyPlan-schema'
import { EmployeeSchema } from '@/utils/employee-schema'
import { EmployeesTaskCropPlanSchema, EmployeeTaskCropPlanSchema, TaskCropIncompleteSchema, TaskCropSchema, TaskCropWeeklyPlanDetailSchema } from '@/utils/taskCropWeeklyPlan-schema'
import { TaskCropWeeklyPlanSchema, TasksCropWeeklyPlanSchema } from "../utils/taskCropWeeklyPlan-schema"
import { DefectsPaginateSchema } from '@/utils/defectos-schema'
import { DefectSchema } from '@/api/ProductsAPI'

export type Tarea = z.infer<typeof TareaSchema>

export type TaskCrop = z.infer<typeof TaskCropSchema>

export type CDP = z.infer<typeof CDPSchema>

export type TaskWeeklyPlan = z.infer<typeof TaskWeeklyPlanSchema>
export type TasksWeeklyPlan = z.infer<typeof TasksWeeklyPlanSchema>
export type TaskWeeklyPlanDetails = z.infer<typeof TaskWeeklyPlanDetailsSchema>

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

export type  MaterialOutput= z.infer<typeof DefectSchema>


