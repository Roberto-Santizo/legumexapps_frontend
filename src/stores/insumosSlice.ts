import { StateCreator } from "zustand";
import { DraftInsumo, Insumos } from "../types";
import clienteAxios from "../config/axios";
import { InsumosSchema } from "../utils/insumos-schema";

export type InsumosSliceType = {
  insumosErrors: string[];

  getInsumosPaginate: (page: number) => Promise<Insumos>;
  createInsumo: (data: DraftInsumo) => Promise<void>;
  uploadInsumos: (file: File[]) => Promise<void>;
};

export const createInsumosSlice: StateCreator<InsumosSliceType> = (set) => ({
  insumosErrors: [],
  getInsumosPaginate: async (page) => {
    try {
      const url = `/api/insumos?page=${page}`;
      const { data } = await clienteAxios(url);
      const result = InsumosSchema.safeParse(data);
      if (result.success) {
        return result.data;
      } else {
        throw new Error("Información no válida");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  createInsumo: async (data) => {
    try {
      const url = `/api/insumos`;
      await clienteAxios.post(url, data);
      set({ insumosErrors: [] });
    } catch (error: any) {
      console.log(error);
      set({ insumosErrors: Object.values(error.response.data.errors) });
      throw error;
    }
  },
  uploadInsumos: async (file) => {
    try {
      const url = "/api/insumos/upload";
      const formData = new FormData();
      formData.append("file", file[0]);
      await clienteAxios.post(url, formData);
      set({ insumosErrors: [] });
    } catch (error: any) {
      console.log(error);
      set({ insumosErrors: error.response.data.message });
      throw error;
    }
  },
});
