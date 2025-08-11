import { SkusPaginatedSchema, StockKeepingUnitSchema } from "@/utils/stockKeepingUnitSchemas";
import { z } from "zod";


export type StockKeepingUnit = z.infer<typeof StockKeepingUnitSchema>;
export type PagintedStockKeepingUnits = z.infer<typeof SkusPaginatedSchema>
