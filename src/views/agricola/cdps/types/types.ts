import { z } from "zod";
import { PlantationControlSchema } from "../schemas/schemas";

export type FiltersCDPType = {
  cdp: string;
  start_date: string;
  end_date: string;
}

export type DraftCDP = {
  name: string;
  start_date: string;
  end_date: string;
}

export type PlantationControl = z.infer<typeof PlantationControlSchema>