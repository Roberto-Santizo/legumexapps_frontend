import z from 'zod';
export const DashboardProductionSchema = z.object({
  line: z.string(),
  finished_tasks: z.number(),
  total_tasks: z.number(),
  percentage: z.number(),
});

export const DashboardProductionResponseSchema = z.array(DashboardProductionSchema);
export type DashboardProduction = z.infer<typeof DashboardProductionSchema>;

