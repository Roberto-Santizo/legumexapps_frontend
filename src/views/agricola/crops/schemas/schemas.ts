import { z } from "zod";

//CROPS
export const CropSchema = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string()
});

export const CropsResponseSchema = z.object({
    statusCode: z.number(),
    response: z.array(CropSchema)
});

//CROP PART
export const CropPartSchema = z.object({
    id: z.number(),
    name: z.string()
});

export const CropPartResponseSchema = z.object({
    statusCode: z.number(),
    response: z.array(CropPartSchema)
});

//CROP DISESES
export const CropDiseaseSchema = z.object({
    id: z.number(),
    name: z.string(),
    week: z.number()
});

export const CropDiseaseResponseSchema = z.object({
    statusCode: z.number(),
    response: z.array(CropDiseaseSchema)
});

export const CropDiseaseByIdResponseSchema = z.object({
    statusCode: z.number(),
    response: CropDiseaseSchema
});

export const ImageDiseaseCropSchema = z.object({
    id: z.number(),
    path: z.string()
});

export const CropDiseaseImagesByIdResponseSchema = z.object({
    statusCode: z.number(),
    response: z.array(ImageDiseaseCropSchema)
});

//SYMPTOMS
export const CropDiseaseSymptomSchema = z.object({
    id: z.number(),
    symptom: z.string(),
    part: z.string(),
    disease: z.string(),
    cropDiseaseId: z.number(),
    crop_disease_id: z.number(),
    crop_part_id: z.number()
});

export const CropDiseaseSymptoResponseSchema = z.object({
    statusCode: z.number(),
    response: z.array(CropDiseaseSymptomSchema)
});