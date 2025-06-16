import { InsumoSchema, InsumosSchema } from "@/utils/insumoSchemas";
import { z } from "zod";

export type Insumo = z.infer<typeof InsumoSchema>;
export type Insumos = z.infer<typeof InsumosSchema>;
export type DraftInsumo = Omit<Insumo, 'id'>;