import clienteAxios from "@/config/axios";
import { DraftCDP } from "@/views/agricola/cdps/CreateCdp";
import { FiltersCDPType } from "@/views/agricola/cdps/IndexCdps";
import { isAxiosError } from "axios";
import { z } from "zod";

export async function createCDP(cdp: DraftCDP) {
    try {
        const url = '/api/cdps'
        const { data } = await clienteAxios.post<string>(url, cdp);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function uploadCDPS(file: File[]) {
    try {
        const url = '/api/cdps/upload';
        const formData = new FormData();
        formData.append("file", file[0]);
        const { data } = await clienteAxios.post<string>(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}


export const Plantation = z.object({
    crop: z.string(),
    id: z.string(),
    name: z.string(),
    recipe: z.string(),
    density: z.number(),
    start_date: z.string(),
    end_date: z.union([z.string(), z.null()]),
    size: z.string(),
    aplication_week: z.number(),
    status: z.boolean()

});

export type Plantation = z.infer<typeof Plantation>

export const PlantationsPaginateSchema = z.object({
    data: z.array(Plantation),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional(),
});

export type PlantationsPaginate = z.infer<typeof PlantationsPaginateSchema>


export async function getCDPS({ page, filters, paginated }: { page: number, filters: FiltersCDPType, paginated: string }): Promise<PlantationsPaginate> {
    try {
        const url = `/api/cdps?paginated=${paginated}&page=${page}&cdp=${filters.cdp}&start_date=${filters.start_date}&end_date=${filters.end_date}`;
        const { data } = await clienteAxios(url);
        const result = PlantationsPaginateSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Error al traer los cdps");
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export const CropSchema = z.object({
    id: z.string(),
    name: z.string(),
    variety: z.string()
});

export const CropsSchema = z.object({
    data: z.array(CropSchema)
})

export type Crop = z.infer<typeof CropSchema>


export async function getCrops(): Promise<Crop[]> {
    try {
        const url = '/api/crops'
        const { data } = await clienteAxios(url)
        const result = CropsSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export const RecipeSchema = z.object({
    id: z.string(),
    name: z.string()
});

export const RecipesSchema = z.object({
    data: z.array(RecipeSchema)
});

export type Recipe = z.infer<typeof RecipeSchema>


export async function getRecipes(): Promise<Recipe[]> {
    try {
        const url = '/api/recipes'
        const { data } = await clienteAxios(url)
        const result = RecipesSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("La información no es válida");
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}