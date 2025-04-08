import { z } from "zod";
import clienteAxios from "@/config/axios";

const getReceptionsPendingQualityTestSchema = z.object({
    total_docs: z.number()
})

export async function getReceptionsPendingQualityTest() : Promise<number> {
    try {
        const url = '/api/rm-receptions-pending/quality-test';
        const { data } = await clienteAxios(url);
        const result = getReceptionsPendingQualityTestSchema.safeParse(data);
        if(result.success){
            return result.data.total_docs
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const RepectionByPercentageSchema = z.object({
    name: z.string(),
    field_percentage: z.number(),
    quality_percentage: z.number()
}); 

export type ReceptionByPercentage = z.infer<typeof RepectionByPercentageSchema>;

const RepectionsByPercentageSchema = z.object({
    data: z.array(RepectionByPercentageSchema)
});


export async function getReceptionsByPercentageDiference() : Promise<ReceptionByPercentage[]> {
    try {
        const url = '/api/rm-receptions/by-percentage-diference';
        const { data } = await clienteAxios(url);
        const result = RepectionsByPercentageSchema.safeParse(data);
        if(result.success){
            return result.data.data
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}