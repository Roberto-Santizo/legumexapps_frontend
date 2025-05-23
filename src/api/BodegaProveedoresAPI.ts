import { z } from "zod";
import { DraftSuppliers } from "@/views/bodega/proveedores/CrearProveedor";
import { isAxiosError } from "axios";
import clienteAxios from "@/config/axios";

export const SupplierSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
});

export const SuppliersPaginatedSchema = z.object({
    data: z.array(SupplierSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    }).optional()
})

export type Supplier = z.infer<typeof SupplierSchema>
export type PaginatedSuppliers = z.infer<typeof SuppliersPaginatedSchema>

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

export async function getPackingMaterialProveedores({ page, paginated }: { page: number, paginated: string }): Promise<PaginatedSuppliers> {
    try {
        const url = `/api/suppliers-packing-material?paginated=${paginated}&page=${page}`;
        const { data } = await clienteAxios(url);
        const result = SuppliersPaginatedSchema.safeParse(data);

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