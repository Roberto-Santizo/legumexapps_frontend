import { StateCreator } from "zustand";

export type BoletasRecepcionType = {
    getBoletasRMP: () => Promise<void>;
}

export const createBoletaRecepcionSlice: StateCreator<BoletasRecepcionType> = () => ({
    getBoletasRMP: async () => {
       console.log('trayendo datos');
    }
})