import {  DraftTaskWeeklyPlanSchema, TasksWeeklyPlanSchema, TaskWeeklyPlanDetailsSchema, TaskWeeklyPlanForCalendarSchema, TaskWeeklyPlanSchema, TaskWeeklyPlanWithNoOperationDateSchema } from "@/utils/taskWeeklyPlanSchemas"
import { z } from "zod"

export type TaskWeeklyPlan = z.infer<typeof TaskWeeklyPlanSchema>;
export type TasksWeeklyPlan = z.infer<typeof TasksWeeklyPlanSchema>;
export type TaskWeeklyPlanDetails = z.infer<typeof TaskWeeklyPlanDetailsSchema>;
export type TaskWeeklyPlanWithNoOperationDate= z.infer<typeof TaskWeeklyPlanWithNoOperationDateSchema>;
export type TaskWeeklyPlanForCalendar = z.infer<typeof TaskWeeklyPlanForCalendarSchema>;
export type DraftTaskWeeklyPlan = z.infer<typeof DraftTaskWeeklyPlanSchema>;