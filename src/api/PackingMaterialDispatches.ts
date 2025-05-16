import { DraftDispatchPackingMaterial } from "@/components/modals/ModalEntregaMaterialEmpaque";
import clienteAxios from "@/config/axios";

export async function createPackingMaterialDispatch(FormData: DraftDispatchPackingMaterial) {
    try {
        const url = '/api/dispatch-material-reception';
        const { data } = await clienteAxios.post(url, FormData);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}