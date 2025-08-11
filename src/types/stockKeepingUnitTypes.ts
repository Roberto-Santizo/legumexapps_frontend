import { SKUSchema, SkusPaginatedSchema } from "@/utils/stockKeepingUnitSchemas";
import { z } from "zod";


export type StockKeepingUnit = z.infer<typeof SKUSchema>;
export type PagintedStockKeepingUnits = z.infer<typeof SkusPaginatedSchema>
