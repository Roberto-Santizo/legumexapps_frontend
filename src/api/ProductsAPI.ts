import clienteAxios from "@/config/axios";
import { DraftDefecto, DraftProduct, PaginateProducts, Product } from "@/types";
import { DetailProductSchema, ProductsPaginateSchema, ProductsSchema } from "@/utils/product-schema";

export async function createProduct(data: DraftProduct, defects: DraftDefecto[]): Promise<void | string[]> {
    try {
        const url = '/api/products';
        await clienteAxios.post(url, { data, defects });
    } catch (error: any) {
        console.log(error);
        return Object.values(error.response.data.errors);
    }
}

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

export async function getProductById(id : Product['id']) {
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

export async function editProduct(id: Product['id'], data: DraftProduct, defects: DraftDefecto[]) : Promise<void> {
    try {
        const url = `/api/products/${id}`;
        await clienteAxios.put(url, { data, defects });
    } catch (error) {
        throw error;
    }
}