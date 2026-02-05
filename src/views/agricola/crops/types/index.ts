import { z } from "zod";
import { CropDiseaseSchema, CropDiseaseSymptomSchema, CropPartSchema, CropSchema, ImageDiseaseCropSchema } from '../schemas/schemas';

export type Crop = z.infer<typeof CropSchema>;
export type DraftCrop = Pick<Crop, 'name' | 'code'>;

export type CropPart = z.infer<typeof CropPartSchema>;
export type DraftCropPart = Pick<CropPart, 'name'> & { crop_id: number };

export type CropDisease = z.infer<typeof CropDiseaseSchema>;
export type DraftCropDisease = Pick<CropDisease, 'name'> & { crop_id: number, week: number };

export type CropDiseaseImage = z.infer<typeof ImageDiseaseCropSchema>;

export type DraftCropDiseaseImage = { image: File[] }

export type CropDiseaseSymptom = z.infer<typeof CropDiseaseSymptomSchema>;
export type DraftCropDiseaseSymptom = Omit<CropDiseaseSymptom, 'id'>;