import clienteAxios from "@/config/axios";
import { FiltersSku } from "@/views/produccion/sku/IndexSKU";
import { isAxiosError } from "axios";
import { DraftRawMaterialSkuItemRecipe } from "types/skuTypes";
import { DraftSku } from "views/produccion/sku/CreateSKU";
import { z } from "zod";

export const SKUSchema = z.object({
    id: z.string(),
    code: z.string(),
    product_name: z.string(),
    presentation: z.string().nullable(),
    client_name: z.string()
});

export const SkusPaginatedSchema = z.object({
    data: z.array(SKUSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional()
});

export type SKU = z.infer<typeof SKUSchema>;
export type SkusPaginated = z.infer<typeof SkusPaginatedSchema>

export async function getSkus({ page, paginated, filters }: { page: number, paginated: string, filters: FiltersSku }) {
    try {
        const url = `/api/skus?paginated=${paginated}&page=${page}&product_name=${filters.product_name}&code=${filters.code}`;
        const { data } = await clienteAxios(url);
        const result = SkusPaginatedSchema.safeParse(data);
        if (result.success) {
            return result.data
        } else {
            throw new Error("Información valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const ItemRecipeSchema = z.object({
    id: z.string(),
    product: z.string(),
    code: z.string()
});

export const SKUDetailsSchema = SKUSchema.pick({ id: true, client_name: true, code: true }).extend({
    packing_material_recipe: z.array(ItemRecipeSchema.extend({ lbs_per_item: z.number() })),
    raw_material_recipe: z.array(ItemRecipeSchema.extend({ percentage: z.number() }))
});

export async function getSkuById({ id }: { id: SKU['id'] }) {
    try {
        const url = `/api/skus/${id}`;
        const { data } = await clienteAxios(url);

        const result = SKUDetailsSchema.safeParse(data);
        if (result.success) {
            return result.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}


export async function createSKU(FormData: DraftSku) {
    try {
        const url = '/api/skus';
        const { data } = await clienteAxios.post<string>(url, FormData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else if (error.response?.data.msg) {
                throw new Error(error.response?.data.msg);
            }
        }
    }
}

export async function uploadSkus(file: File[]) {
    try {
        const url = '/api/skus/upload';
        const formData = new FormData();
        formData.append("file", file[0]);
        const { data } = await clienteAxios.post(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else if (error.response?.data.msg) {
                throw new Error(error.response?.data.msg);
            }
        }
    }
}

export async function uploadSkusRecipes(file: File[]) {
    try {
        const url = '/api/skus/upload/recipe';
        const formData = new FormData();
        formData.append("file", file[0]);
        const { data } = await clienteAxios.post(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else if (error.response?.data.msg) {
                throw new Error(error.response?.data.msg);
            }
        }
    }
}


export async function uploadSkusRecipesRawMaterial(file: File[]) {
    try {
        const url = '/api/raw-material-items-recipes/upload';
        const formData = new FormData();
        formData.append("file", file[0]);
        const { data } = await clienteAxios.post(url, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response?.data.errors) {
                throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
            } else if (error.response?.data.msg) {
                throw new Error(error.response?.data.msg);
            }
        }
    }
}

export const RawMaterialRecipeItemSchema = z.object({
    id: z.number(),
    percentage: z.number(),
    stock_keeping_unit_id: z.number(),
    raw_material_item_id: z.number()

});

export async function getSkuRecipeItemById({ id }: { id: string }) {
    try {
        const url = `/api/raw-material-items-recipes/item/${id}`;
        const { data } = await clienteAxios(url);

        const result = RawMaterialRecipeItemSchema.safeParse(data);
        if (result.success) {
            return result.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}

export async function editSkuRecipeItem({ id, formData }: { id: string, formData: DraftRawMaterialSkuItemRecipe }) {
    try {
        const url = `/api/raw-material-items-recipes/${id}`;
        const { data } = await clienteAxios.put(url, formData);

        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);
        }
    }
}
