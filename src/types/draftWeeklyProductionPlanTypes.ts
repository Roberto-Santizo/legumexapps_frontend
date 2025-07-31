import { DraftWeeklyPlanSummaryItemSchema, DraftWeeklyProductionPlanSchema } from "@/utils/draftWeeklyProductionPlanSchemas";
import { z } from "zod";

export type WeeklyProductionPlanDraft = z.infer<typeof DraftWeeklyProductionPlanSchema>;
export type WeeklyProductionPlanDraftSummaryItem = z.infer<typeof DraftWeeklyPlanSummaryItemSchema>;