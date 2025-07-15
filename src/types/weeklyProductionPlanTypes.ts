import { TaskProductionEventSchema, TaskProductionNoOperationDateSchema } from "@/utils/taskProductionPlanSchemas";
import { LineWeeklyProductionPlanSchema, WeeklyPlanTasksOperationDateSchema, WeeklyProductionPlanEventsShema, WeeklyProductionPlanSchema } from "@/utils/weeklyProductionPlanSchemas";
import { z } from "zod";

export type WeeklyProductionPlan = z.infer<typeof WeeklyProductionPlanSchema>;
export type LineWeeklyProductionPlan = z.infer<typeof LineWeeklyProductionPlanSchema>;
export type WeeklyProductionPlanEvents = z.infer<typeof WeeklyProductionPlanEventsShema>;
export type WeeklyProductionPlanEvent = z.infer<typeof TaskProductionEventSchema>;
export type WeeklyProductionPlanNoOperationDate = z.infer<typeof TaskProductionNoOperationDateSchema>;
export type WeeklyPlanTasksOperationDate = z.infer<typeof WeeklyPlanTasksOperationDateSchema>