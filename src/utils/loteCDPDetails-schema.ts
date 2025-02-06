import { z } from "zod";

export const InsumoSchema = z.object({
  id: z.string(),
  name: z.string(),
  assigned_quantity: z.number(),
  measure: z.string(),
  used_quantity: z.number().nullable(), 
});

export const TaskSchema = z.object({
  id: z.number(),
  calendar_week: z.number(),
  task: z.string(),
  hours: z.number(),
  real_hours: z.number().nullable(),
  aplication_week: z.number(),
  performance: z.number().nullable(),
  closed: z.boolean(),
  insumos: z.array(InsumoSchema), 
});

export const DataLoteSchema = z.object({
  lote: z.string(),
  cdp: z.string(),
  start_date_cdp: z.string(), 
  end_date_cdp: z.string().nullable()
});

export const DataSchema = z.record(z.array(TaskSchema));

export const LoteCDPDetailsSchema = z.object({
  data_lote: DataLoteSchema,
  data: DataSchema,
});
