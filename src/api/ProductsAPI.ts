import { DraftDefecto } from "@/components/modals/ModalCrearDefecto";
import clienteAxios from "@/config/axios";
import { DraftProduct } from "@/views/calidad/productos/CrearProduct";
import { isAxiosError } from "axios";
import { z } from "zod";

export async function createProduct({ FormData, defects }: { FormData: DraftProduct, defects: DraftDefecto[] }) {
    try {
        const url = '/api/products';
        const { data } = await clienteAxios.post<string>(url, { data : FormData, defects });
        return data;
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export const ProductSchema = z.object({
    id: z.string(),
    product: z.string(),
    variety: z.string(),
});

export type Product = z.infer<typeof ProductSchema>


export const ProductsPaginateSchema = z.object({
    data: z.array(ProductSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});

export type PaginateProducts = z.infer<typeof ProductsPaginateSchema>


export async function getPaginatedProducts(page: number): Promise<PaginateProducts> {
    try {
        const url = `/api/products?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = ProductsPaginateSchema.safeParse(data);

        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const ProductsSchema = z.object({
    data:z.array(ProductSchema)
});

export async function getProducts(): Promise<Product[]> {
    try {
        const url = '/api/products-all';
        const { data } = await clienteAxios(url);
        const result = ProductsSchema.safeParse(data);
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

export const DefectSchema = z.object({
    id: z.number(),
    name: z.string(),
    tolerance_percentage: z.number(),
    status: z.boolean(),
});

export const DetailProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    variety_product_id: z.string(),
    accepted_percentage: z.number(),
    defects: z.array(DefectSchema)

});

export type ProductDetail = z.infer<typeof DetailProductSchema>


export async function getProductById(id: Product['id']) {
    try {
        const url = `/api/products/${id}`;
        const { data } = await clienteAxios(url);
        const result = DetailProductSchema.safeParse(data.data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function editProduct(id: Product['id'], data: DraftProduct, defects: DraftDefecto[]): Promise<void> {
    try {
        const url = `/api/products/${id}`;
        await clienteAxios.put(url, { data, defects });
    } catch (error) {
        throw error;
    }
}