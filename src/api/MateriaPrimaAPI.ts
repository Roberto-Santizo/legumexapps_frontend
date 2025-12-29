import clienteAxios from "@/config/axios";
import { MateriaPrimaItemSchema, MateriaPrimaItemsSchema } from "@/utils/materiaPrimaSchemas";
import { isAxiosError } from "axios";
import { DraftMateriaPrimaItem, MateriaPrimaItem } from "@/types/materiaPrimaTypes";

export async function createMateriaPrimaItem({ formData }: { formData: DraftMateriaPrimaItem }) {
    try {
        const url = `/api/raw-material-items`;
        const { data } = await clienteAxios.post(url, formData);

        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);

        }
    }
}

export async function getMateriaPrimaItems({ paginated, currentPage }: { paginated: string, currentPage: number }) {
    try {
        const url = `/api/raw-material-items?paginated=${paginated}&page=${currentPage}`;
        const { data } = await clienteAxios(url);

        const result = MateriaPrimaItemsSchema.safeParse(data);

        if (result.success) {
            return result.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);

        }
    }
}

export async function getMateriaPrimaItemById({ id }: { id: MateriaPrimaItem['id'] }) {
    try {
        const url = `/api/raw-material-items/${id}`;
        const { data } = await clienteAxios(url);

        const result = MateriaPrimaItemSchema.safeParse(data);

        if (result.success) {
            return result.data;
        }
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);

        }
    }
}

export async function editMateriaPrimaItem({ id, formData }: { id: MateriaPrimaItem['id'], formData: DraftMateriaPrimaItem }) {
    try {
        const url = `/api/raw-material-items/${id}`;
        const { data } = await clienteAxios.put(url, formData);

        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.msg);

        }
    }
}