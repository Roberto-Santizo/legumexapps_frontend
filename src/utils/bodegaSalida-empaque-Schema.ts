import { z } from "zod";

export const MaterialRegisterSchema = z.object({
    id: z.string(),
    reference: z.string(),
    responsable_bags: z.string(),
    responsable_boxes: z.string(),
    signature_responsable_boxes: z.string(),
    signature_responsable_bags: z.string(),
    observations: z.string(),
    user_signature: z.string(),
});

export const MaterialOutputDetaills = z.object({
  id: z.string(),
  quantity: z.number(),
  lote: z.string(),
});

