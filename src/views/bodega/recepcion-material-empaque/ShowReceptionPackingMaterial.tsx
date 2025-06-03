import { useQuery } from "@tanstack/react-query";
import BoletaIngresoMaterialEmpaque from "@/components/boleta-bodega/BoletaIngresoMaterialEmpaque";
import { getReceptionPackingMaterialById } from "@/api/ReceptionPackingMaterialsAPI";
import { useParams } from "react-router-dom";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";


export default function ShowReceptionPackingMaterial() {
    const params = useParams();
    const id = params.id!!;


    const { data, isLoading, isError } = useQuery({
        queryKey: ['getReceptionPackingMaterialById', id],
        queryFn: () => getReceptionPackingMaterialById(id)
    });

    if (isLoading) return <Spinner />;
    if (isError) return <ShowErrorAPI />;
    if (data) return (
        <BoletaIngresoMaterialEmpaque data={data}/>
    )
}
