import { z } from "zod";
import { DraftTaskProductionPlanSchema } from "./draftTaskProductionPlanSchemas";
import { TaskProductionPackingMaterialRecipeSchema } from "./taskProductionPlanSchemas";
import { paginatedSchema } from "./schemas";

export const DraftWeeklyProductionPlanSchema = z.object({
    id: z.string(),
    year: z.number(),
    week: z.number(),
    confirmation_date: z.string().nullable(),
    production_confirmation: z.boolean(),
    bodega_confirmation: z.boolean(),
    logistics_confirmation: z.boolean(),
    plan_created: z.boolean()
});


export const DraftWeeklyProductionPlanDetailsSchema = DraftWeeklyProductionPlanSchema.extend({
    tasks: z.array(DraftTaskProductionPlanSchema)
});

export const WeeklyProductionDraftSchema = DraftWeeklyProductionPlanSchema.pick({ id: true, year: true, week: true, confirmation_date: true }).extend({
    confirmed: z.boolean()
});

export const WeeklyProductionDraftsPaginatedSchema = z.object({
    data: z.array(WeeklyProductionDraftSchema),
    meta: paginatedSchema
});

export const DraftWeeklyPlanSummaryItemSchema = TaskProductionPackingMaterialRecipeSchema.pick({
    name: true,
    quantity: true
}).extend({
    code: z.string(),
    inventory: z.number()
})

export const DraftWeeklyProductionPlanRecipeSchema = z.array(DraftWeeklyPlanSummaryItemSchema);