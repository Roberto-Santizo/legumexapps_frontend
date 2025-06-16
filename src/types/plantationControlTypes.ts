import { PlantationControlSchema } from "@/utils/plantationControlSchemas";
import { z } from "zod";

export type PlantationControl = z.infer<typeof PlantationControlSchema>