import { PackingMaterialItemSchema, PaginatedPackingMaterialItemsSchema } from "@/utils/packingMaterialItemSchema";
import { z } from "zod";

export type PackingMaterialItem = z.infer<typeof PackingMaterialItemSchema>;
export type PaginatedPackingMaterialItems = z.infer<typeof PaginatedPackingMaterialItemsSchema>;
