import { CropSchema } from "@/utils/cropSchemas";
import { z } from "zod";

export type Crop = z.infer<typeof CropSchema>
