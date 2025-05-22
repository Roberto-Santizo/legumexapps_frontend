import clienteAxios from "@/config/axios";
import { isAxiosError } from "axios";

export async function getUserRole() {
    try {
        const url = '/api/user';
        const { data } = await clienteAxios<string>(url);
        return data;
    } catch (error) {
        if(isAxiosError(error)){
            throw new Error(error.response?.data.msg);
            
        }
    }
}