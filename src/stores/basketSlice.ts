import { StateCreator } from "zustand";
import clienteAxios from "../config/axios";
import { BasketsSchema } from "../utils/baskets-schema";
import { Basket } from "../types";

export type BasketSliceType = {
    getAllBaskets: () => Promise<Basket[]>;
}

export const createBasketSlice: StateCreator<BasketSliceType> = () => ({
    getAllBaskets: async () => {
        try {
            const url = '/api/baskets-all';
            const { data } = await clienteAxios(url);
            const result = BasketsSchema.safeParse(data);
            if(result.success){
                return result.data.data;
            }else{
                throw new Error('información no válida');
            }
        } catch (error) {
            throw error;
        }
    }
})