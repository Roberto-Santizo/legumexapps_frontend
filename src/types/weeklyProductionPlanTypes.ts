import { LineWeeklyProductionPlanSchema, WeeklyProductionPlanSchema } from "@/utils/weeklyProductionPlanSchemas";
import { z } from "zod";

export type WeeklyProductionPlan = z.infer<typeof WeeklyProductionPlanSchema>;
export type LineWeeklyProductionPlan = z.infer<typeof LineWeeklyProductionPlanSchema>;
