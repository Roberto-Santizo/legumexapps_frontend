import { z } from "zod";
import { DraftSuppliers } from "@/views/bodega/proveedores/CrearProveedor";
import { isAxiosError } from "axios";
import clienteAxios from "@/config/axios";

export const WareHouseSupplierSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
});

export const WarehousePaginateSchema = z.object({
    data: z.array(WareHouseSupplierSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
})

export const WarehousesPaginateSchema = z.object({
    data: z.array(WareHouseSupplierSchema)
});

export type Supplier = z.infer<typeof WareHouseSupplierSchema>
export type SupplierPaginate = z.infer<typeof WarehousePaginateSchema>

export async function createProveedor(FormData: DraftSuppliers) {
    try {
        const url = '/api/suppliers-packing-material';
        const { data } = await clienteAxios.post<string>(url, FormData)
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function getPaginatedProveedor(page: number): Promise<SupplierPaginate> {
    try {
        const url = `/api/suppliers-packing-material?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = WarehousePaginateSchema.safeParse(data);

        if (result.success) {
            return result.data;
        } else {
            throw new Error('Hubo un error al trear los proveedores');
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export async function getAllProveedores(): Promise<Supplier[]> {
    try {
        const url = '/api/suppliers-packing-material-all';
        const { data } = await clienteAxios(url);
        const result = WarehousesPaginateSchema.safeParse(data);
        if (result.success) {
            return result.data.data
        } else {
            throw new Error("Información no válida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}