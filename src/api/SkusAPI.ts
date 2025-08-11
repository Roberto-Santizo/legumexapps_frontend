import { FiltersSku } from "@/views/produccion/stock-keeping-units/Index";
import { isAxiosError } from "axios";
import { DraftRawMaterialSkuItemRecipe } from "types/skuTypes";
import { DraftSku } from "@/views/produccion/stock-keeping-units/Create";
import { RawMaterialRecipeItemSchema, SKUDetailsSchema, SkusPaginatedSchema } from "@/utils/stockKeepingUnitSchemas";
import { StockKeepingUnit } from "types/stockKeepingUnitTypes";
import clienteAxios from "@/config/axios";

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

export async function getSkuById({ id }: { id: StockKeepingUnit['id'] }) {
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
