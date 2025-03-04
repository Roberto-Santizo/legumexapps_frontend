import clienteAxios from "@/config/axios";
import { z } from 'zod';

const WeeklyPlanProductionPlanSchema = z.object({
    id:z.number(),
    week: z.number(),
    year: z.number()
});

export type WeeklyPlanProductionPlan = z.infer<typeof WeeklyPlanProductionPlanSchema>

const PaginatedWeeklyProductionPlansSchema = z.object({
    data: z.array(WeeklyPlanProductionPlanSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })

});

export type PaginatedWeeklyProductionPlans = z.infer<typeof PaginatedWeeklyProductionPlansSchema>

export async function getPaginatedWeeklyProductionPlans(page: number) : Promise<PaginatedWeeklyProductionPlans> {
    try {
        const url = `/api/weekly_production_plan?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = PaginatedWeeklyProductionPlansSchema.safeParse(data);
        if(result.success){
            return result.data
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}