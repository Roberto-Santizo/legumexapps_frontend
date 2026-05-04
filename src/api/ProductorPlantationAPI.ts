import clienteAxios from "@/config/axios";
import { z } from "zod";

export const DraftProductorCdpSchema = z.object({
    name: z.string(),
    finca_id: z.string(),
})

export const ProductorCDPSchema = z.object({
    id: z.string(),
    name: z.string(),
    finca: z.string()
})

export const ProductorCDPSSchema = z.object({
    data: z.array(ProductorCDPSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional()
});

export type ProductorCDP = z.infer<typeof ProductorCDPSchema>
export type DraftProductorCdp = z.infer<typeof DraftProductorCdpSchema>


export async function getAllProductorCDPS({ page, paginated }: { page: number, paginated: string }) {
    try {
        const url = `/api/productor-cdp?paginated=${paginated}&page=${page}`;
        const { data } = await clienteAxios(url);
        const result = ProductorCDPSSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        throw error;
    }
}


export async function createProductorCdp(payload: DraftProductorCdp) {
    try {
        const url = `/api/productor-cdp`;
        const { data } = await clienteAxios.post<string>(url, payload);

        return data;
    } catch (error) {
        throw error;
    }
}