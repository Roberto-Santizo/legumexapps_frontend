import { DraftTaskProductionPlanSchema } from "@/utils/draftTaskProductionPlanSchemas";
import { z } from "zod";

export type TaskProductionPlanDraft = z.infer<typeof DraftTaskProductionPlanSchema>;