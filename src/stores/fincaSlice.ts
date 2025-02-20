import { StateCreator } from "zustand"
import clienteAxios from "../config/axios";
import { Finca } from "../types";
import { Fincas } from "../utils/fincas-schema";

export type FincaSliceType = {
    fetchFincas: () => Promise<Finca[]>;
}

export const createFincaSlice: StateCreator<FincaSliceType> = () => ({
    fetchFincas: async () => {
        try {
            const url = '/api/fincas';
            const { data } = await clienteAxios(url)
            const result = Fincas.safeParse(data);
            if(result.success){
                return result.data.data
            }else{
                throw new Error("Existe un error al traer las fincas");
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
})