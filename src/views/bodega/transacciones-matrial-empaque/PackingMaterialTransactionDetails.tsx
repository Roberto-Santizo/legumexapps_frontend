import { getPackingMaterialTransactionById, PackingMaterialTransaction } from "@/api/PackingMaterialTransactions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import DevolucionBodega from "@/components/boleta-bodega/DevolucionBodega";
import SalidaBodegaEmpaque from "@/components/boleta-bodega/SalidaBodegaEmpaque";

export default function PackingMaterialTransactionDetails() {
    const params = useParams<{ id: PackingMaterialTransaction['id'] }>();
    const id = params.id!;

    const { data } = useQuery({
        queryKey: ['getPackingMaterialTransactionById', id],
        queryFn: () => getPackingMaterialTransactionById({ id })
    });

    if (data) return (
        <div className="p-10 space-y-5" >
            {data.type === 1 && (
                <SalidaBodegaEmpaque transaction={data} />
            )}
            {data.type === 2 && (
                <DevolucionBodega transaction={data} />
            )}
        </div>
    )
}
