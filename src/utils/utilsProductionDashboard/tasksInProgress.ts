import { z } from "zod";

export const TasksInProgressSchema = z.object({
  id: z.number(),
  line: z.string(),
  sku: z.string(),
  product: z.string(),
});

export const DashboardProductionResponseSchema = z.object({
  data: z.array(TasksInProgressSchema),
});

export type DashboardProduction = z.infer<typeof TasksInProgressSchema>;
export type DashboardProductionResponse = z.infer<typeof DashboardProductionResponseSchema>;
