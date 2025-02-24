import clienteAxios from "@/config/axios";
import { Product } from "@/types";
import { DefectsSchema } from "@/utils/defectos-schema";

export async function getDefectsByQualityProduct(id: Product['id']) {
    try {
        const url = `/api/defects-by-product/${id}`;
        const { data } = await clienteAxios(url);
        const result = DefectsSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}