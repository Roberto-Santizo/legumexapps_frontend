import { z } from "zod";

export const TaskWeeklyPlanSchema = z.object({
  id: z.string(),
  cdp: z.string(),
  task: z.string(),
  week: z.number(),
  hours: z.number(),
  budget: z.number(),
  finca_id: z.string(),
  lote_plantation_control_id: z.string(),
  active_closure: z.boolean(),
  weekly_plan_id: z.string(),
  slots: z.number(),
  lote: z.string(),
  minimum_slots: z.number(),
  start_date: z.union([z.string(), z.null()]),
  end_date: z.union([z.string(), z.null()]),
  start_time: z.union([z.string(), z.null()]),
  end_time: z.union([z.string(), z.null()]),
});

export const EditTaskWeeklySchema = z.object({
  task: z.string(),
  hours: z.number(),
  budget: z.number(),
  slots: z.number(),
  weekly_plan_id: z.string(),
  start_date: z.string(),
  start_time: z.string(),
  end_date: z.string(),
  end_time: z.string(),
});

export const TaskWeeklyPlanDetailsSchema = z.object({
  task: z.string(),
  lote: z.string(),
  week: z.number(),
  finca: z.string(),
  aplication_week: z.number(),
  start_date: z.union([z.string(), z.null()]),
  end_date: z.union([z.string(), z.null()]),
  hours: z.number(),
  real_hours: z.union([z.number(), z.null()]),
  slots: z.number(),
  total_employees: z.number(),
  employees: z.array(
    z.object({
      name: z.string(),
      code: z.string(),
    })
  ),
  closures: z.array(
    z.object({
      start_date: z.string(),
      end_date: z.string(),
    })
  ),
});

export const TasksWeeklyPlanSchema = z.object({
  finca: z.string(),
  week: z.number(),
  lote: z.string(),
  data: z.array(TaskWeeklyPlanSchema),
});

export const TaskCropWeeklyPlanSchema = z.object({
  id: z.string(),
  task: z.string(),
  cultivo: z.string(),
  assigment_today: z.boolean(),
  finished_assigment_today: z.boolean()
});

export const TasksCropWeeklyPlanSchema = z.object({
  week: z.number(),
  finca: z.string(),
  lote: z.string(),
  tasks: z.array(TaskCropWeeklyPlanSchema),
});
