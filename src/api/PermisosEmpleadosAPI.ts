import clienteAxios from "@/config/axios";
import { z } from "zod";

export const PermisoEmpleadoSchema = z.object({
    id: z.string(),
    line: z.string(),
    new_code: z.string(),
    new_name: z.string(),
    new_position: z.string(),
    original_code: z.string(),
    original_name: z.string(),
    original_position: z.string(),
    confirmed: z.boolean(),
    permission: z.boolean(),
    date: z.string()
});

export const PermisosEmpleadosPaginatedSchema = z.object({
    data: z.array(PermisoEmpleadoSchema),
    meta: z.object({
        last_page: z.number(),
        current_page: z.number()
    })
});


export type PermisoEmpleado = z.infer<typeof PermisoEmpleadoSchema>;
export type PermisosEmpleadosPaginated = z.infer<typeof PermisosEmpleadosPaginatedSchema>;

export async function getPermisosEmpleadosPaginated(page: number): Promise<PermisosEmpleadosPaginated> {
    try {
        const url = `/api/employee-permissions?page=${page}`;
        const { data } = await clienteAxios(url);
        const result = PermisosEmpleadosPaginatedSchema.safeParse(data);
        if (result.success) {
            return result.data;
        } else {
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getPermisoEmployeeById(id : PermisoEmpleado['id']) : Promise<PermisoEmpleado> {
    try {
        const url = `/api/employee-permissions/${id}`;
        const {  data } = await clienteAxios(url);
        const result = PermisoEmpleadoSchema.safeParse(data.data);
        if(result.success){
            return result.data;
        }else{
            throw new Error("Información no valida");
        }
    } catch (error) {
        console.log(error);
        throw error;
    } 
}

export async function closeEmployeePermission(id: PermisoEmpleado['id'], flag: string) {
    try {
        const url = `/api/employee-permissions/${id}`;
        await clienteAxios.patch(url, {
            permission: flag
        });
    } catch (error) {
        console.log(error);
        throw error;
    }

}