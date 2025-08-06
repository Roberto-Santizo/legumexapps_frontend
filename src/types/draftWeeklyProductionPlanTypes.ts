import { DraftWeeklyPlanSummaryItemSchema, DraftWeeklyProductionPlanDetailsSchema, DraftWeeklyProductionPlanSchema } from "@/utils/draftWeeklyProductionPlanSchemas";
import { z } from "zod";

export type WeeklyProductionPlanDraft = z.infer<typeof DraftWeeklyProductionPlanSchema>;
export type tWeeklyProductionPlanDraftDetailsSchema = z.infer<typeof DraftWeeklyProductionPlanDetailsSchema>
export type WeeklyProductionPlanDraftSummaryItem = z.infer<typeof DraftWeeklyPlanSummaryItemSchema>;