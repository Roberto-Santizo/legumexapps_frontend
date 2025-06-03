import { getInsumosReceiptById } from "@/api/RecepcionInsumosAPI";
import IngresoInsumos from "@/components/boleta-bodega/IngresoInsumos";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function ShowReceptionInsumosDetails() {
  const params = useParams();
  const id = params.id!!;

  const { data: receipt } = useQuery({
    queryKey: ['getInsumosReceiptById'],
    queryFn: () => getInsumosReceiptById(id)
  });

  if (receipt) return (
    <IngresoInsumos receipt={receipt} />
  )
}
