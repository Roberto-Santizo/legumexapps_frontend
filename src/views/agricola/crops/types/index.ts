import { z } from "zod";
import { CropPartSchema, CropSchema } from '../schemas/schemas';

export type Crop = z.infer<typeof CropSchema>;
export type DraftCrop = Pick<Crop, 'name' | 'code'>;

export type CropPart = z.infer<typeof CropPartSchema >;