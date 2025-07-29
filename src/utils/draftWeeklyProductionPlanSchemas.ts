import { z } from "zod";
import { DraftTaskProductionPlanSchema } from "./draftTaskProductionPlanSchemas";
import { TaskProductionPackingMaterialRecipeSchema } from "./taskProductionPlanSchemas";

export const DraftWeeklyProductionPlanSchema = z.object({
    id: z.string(),
    year: z.number(),
    week: z.number(),
    confirmation_date: z.string().nullable(),
    production_confirmation: z.boolean(),
    bodega_confirmation: z.boolean(),
    logistics_confirmation: z.boolean()
});


export const DraftWeeklyProductionPlanDetailsSchema = DraftWeeklyProductionPlanSchema.extend({
    tasks: z.array(DraftTaskProductionPlanSchema)
});

export const DraftWeeklyPlanSummaryItemSchema = TaskProductionPackingMaterialRecipeSchema.pick({
    name: true,
    quantity: true
}).extend({
    code: z.string(),
    inventory: z.number()
})

export const DraftWeeklyProductionPlanPackingMaterialRecipeSchema = z.array(DraftWeeklyPlanSummaryItemSchema);