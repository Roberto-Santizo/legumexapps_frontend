import { z } from "zod";
import { PackingMaterialItemSchema, PaginatedPackingMaterialItemsSchema } from "../schemas/schemas";

export type FiltersPackingMaterialsType = {
  name: string;
  code: string;
  status: string;
  supplier: string;
}

export type ChangeItemStatusEvent = {
  status: string;
}

export type DraftMaterialEmpaque = {
  name: string;
  description: string;
  code: string;
};


export type PackingMaterialItem = z.infer<typeof PackingMaterialItemSchema>;
export type PaginatedPackingMaterialItems = z.infer<typeof PaginatedPackingMaterialItemsSchema>;
