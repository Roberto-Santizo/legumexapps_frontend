// Este codigo yo lo agregue Luis
import { z } from "zod";

export const MaterialReceptionSchema = z.object({
  supervisor_name: z.string(),
  invoice_date: z.string(),
  user_signature: z.string(),
  supervisor_signature: z.string(),

  p_material_id: z.number(),
  lote: z.string(),
  quantity: z.number()
});

export const MaterialReceptionPaginateSchema = z.object({
    data: z.array(MaterialReceptionSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
})
