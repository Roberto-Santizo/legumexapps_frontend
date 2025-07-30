import { MateriaPrimaItemSchema } from "@/utils/materiaPrimaSchemas";
import { z } from "zod";

export type MateriaPrimaItem = z.infer<typeof MateriaPrimaItemSchema>;
export type DraftMateriaPrimaItem = Pick<MateriaPrimaItem, 'code' | 'product_name' | 'type'>;