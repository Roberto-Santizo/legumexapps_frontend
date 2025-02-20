import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { ProductsSchema, ProductsPaginateSchema, DetailProductSchema } from "../utils/product-schema";
import { DraftDefecto, DraftProduct, PaginateProducts, Product, ProductDetail } from "../types";

export type ProductSliceType = {
    createProduct: (data: DraftProduct, defects: DraftDefecto[]) => Promise<void>;
    getProducts: () => Promise<Product[]>
    getPaginateProducts: (page: number) => Promise<PaginateProducts>
    getProductById: (id: Product['id']) => Promise<ProductDetail>
    editProduct: (id: Product['id'], data: DraftProduct, defects: DraftDefecto[]) => Promise<void>;
}

export const createProductSlice: StateCreator<ProductSliceType> = () => ({
    createProduct: async (data, defects) => {
        try {
            const url = '/api/products';
            await clienteAxios.post(url, { data, defects });
        } catch (error) {
            throw error;
        }
    },
    getPaginateProducts: async (page) => {
        try {
            const url = `/api/products?page=${page}`;
            const { data } = await clienteAxios(url);
            const result = ProductsPaginateSchema.safeParse(data);

            console.log(data);
            if (result.success) {
                console.log(result.data);
                return result.data
            } else {
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    },
    getProducts: async () => {
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
            throw error;
        }
    },
    getProductById: async (id) => {
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
            throw error;
        }
    },
    editProduct: async (id, data, defects) => {
        try {
            const url = `/api/products/${id}`;
            await clienteAxios.put(url, { data, defects });
        } catch (error) {
            throw error;
        }
    }
})