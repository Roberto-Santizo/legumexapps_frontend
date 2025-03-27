import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";
import { DraftProductoSKU } from "views/produccion/productos/CrearProductoSku";
import { z } from "zod";

const ProductSKUSchema = z.object({
    name: z.string(),
    presentation: z.string(),
    box_weight: z.number().nullable()
});

const PaginatedProductsSkuSchema = z.object({
    data: z.array(ProductSKUSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export type ProductSKU = z.infer<typeof ProductSKUSchema>;
export type PaginatedProductsSku = z.infer<typeof PaginatedProductsSkuSchema>;

export async function getPaginatedSKUProducts(page: number) : Promise<PaginatedProductsSku> {
    try {
        const url = `/api/sku-products?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = PaginatedProductsSkuSchema.safeParse(data);
        if(result.success){
            return result.data
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const ProductSelectSchema = z.object({
    value: z.string(),
    label: z.string()
});

export const ProductsSKUSchema = z.object({
    data: z.array(ProductSelectSchema)
});

export type ProductSelect = z.infer<typeof ProductSelectSchema>;

export async function getAllProducts() : Promise<ProductSelect[]> {
    try {
        const url = '/api/sku-products-all';
        const { data } = await clienteAxios(url);
        const result = ProductsSKUSchema.safeParse(data);
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

export async function createProductSKU(formData : DraftProductoSKU) {
    try {
        const url = '/api/sku-products';
        const { data } = await clienteAxios.post<string>(url,formData);
        return data;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.msg);
        }
    }
}