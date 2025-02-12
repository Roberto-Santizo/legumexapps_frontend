import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { ProductsSchema } from "../utils/product-schema";
import { Product } from "../types";

export type ProductSliceType = {
    getProducts: () => Promise<Product[]>
}

export const createProductSlice: StateCreator<ProductSliceType> = () => ({
    getProducts: async () => {
        try {
            const url = '/api/products';
            const { data } = await clienteAxios(url);
            const result =  ProductsSchema.safeParse(data);
            if(result.success){
                return result.data.data
            }else{
                throw new Error("Información no válida");
            }
        } catch (error) {
            throw error;
        }
    }
})