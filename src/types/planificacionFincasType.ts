import { SummaryWeeklyPlanSchema, WeeklyPlanSchema, WeeklyPlansSchema} from "@/utils/planificacionFincasSchemas"
import { z } from "zod"

export type WeeklyPlan = z.infer<typeof WeeklyPlanSchema>;
export type WeeklyPlans = z.infer<typeof WeeklyPlansSchema>;
export type SummaryWeeklyPlan = z.infer<typeof SummaryWeeklyPlanSchema>
