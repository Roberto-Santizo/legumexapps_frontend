import { StateCreator } from "zustand";
import { DraftBoletaRMP } from "../types";

export type BoletasRecepcionType = {
    getBoletasRMP: () => Promise<void>;
    createBoletaRMP: (data : DraftBoletaRMP) => Promise<void>;
}

export const createBoletaRecepcionSlice: StateCreator<BoletasRecepcionType> = () => ({
    getBoletasRMP: async () => {
       console.log('trayendo datos');
    },
    createBoletaRMP: async (data) => {
        console.log(data);
    }
})