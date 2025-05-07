import clienteAxios from "@/config/axios";
import { Supplier, SupplierPaginate } from "@/types";

import {WareHouseSupplierSchema, warehousePaginateSchema,warehousesPaginateSchema} from "@/utils/bodega-schema";
import { DraftSuppliers } from "@/views/bodega/formularios/CrearProveedor";
import { isAxiosError } from "axios";

export async function createProveedor(FormData: DraftSuppliers) {
    try {
        const url = '/api/tareas';//Agregar aca la url correcta de proveedores 
        const { data } = await clienteAxios.post<string>(url, FormData)
        return data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function uploadProveedor(file: File[]) {
    try {
        const url = '/api/tareas/upload';
        const formData = new FormData();
        formData.append("file", file[0]);
        const { data } = await clienteAxios.post<string>(url, formData);
        return data;
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}

export async function getPaginatedProveedor(page: number): Promise<SupplierPaginate> {
    try {
        const url = `/api/tareas?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = warehousePaginateSchema.safeParse(data);

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
        const url = '/api/tareas-all';
        const { data } = await clienteAxios(url);
        const result = warehousesPaginateSchema.safeParse(data);
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

export async function getProveedorById(id: Supplier['id']): Promise<Supplier> {
    try {
        const url = `/api/tareas/${id}`
        const { data } = await clienteAxios(url, {
        });
        const result = WareHouseSupplierSchema.safeParse(data.data);
        if (result.success) {
            return result.data
        } else {
            throw new Error('Datos no válidos');
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

export async function updateProveedor({ id, FormData }: { id: Supplier['id'], FormData: DraftSuppliers }) {
    try {
        const url = `/api/tareas/${id}`
        const { data } = await clienteAxios.put<string>(url, FormData);
        return data;
    } catch (error: any) {
        if (isAxiosError(error)) {
            throw new Error(Object.values(error.response?.data?.errors || {}).flat().join('\n'));
        }
    }
}