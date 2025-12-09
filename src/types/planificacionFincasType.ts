import { SummaryWeeklyPlanSchema, WeeklyPlanSchema, WeeklyPlansSchema} from "@/utils/planificacionFincasSchemas"
import { WeeklyEmployeeAssignmentSchema } from "@/utils/taskWeeklyPlanSchemas";
import { z } from "zod"

export type WeeklyPlan = z.infer<typeof WeeklyPlanSchema>;
export type WeeklyPlans = z.infer<typeof WeeklyPlansSchema>;
export type SummaryWeeklyPlan = z.infer<typeof SummaryWeeklyPlanSchema>
export type WeeklyEmployeeAssignment = z.infer<typeof WeeklyEmployeeAssignmentSchema>;
