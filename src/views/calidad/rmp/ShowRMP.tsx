import BoletaCampoRMP from "@/components/boleta-rmp/BoletaCampoRMP";
import BoletasCalidad from "@/components/boleta-rmp/BoletasCalidad";
import { useParams } from "react-router-dom";

import InspeccionTransporte from "@/components/boleta-camion/InspeccionTransporte";
import { useQuery } from "@tanstack/react-query";
import { getBoletaInfoAll } from "@/api/ReceptionsDocAPI";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

export default function ShowRMP() {
  const params = useParams();
  const rm_reception_id = params.rm_reception_id!!;

  const { data: boleta, isLoading, isError } = useQuery({
    queryKey: ['getBoletaInfoAll', rm_reception_id],
    queryFn: () => getBoletaInfoAll(rm_reception_id)
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (boleta) return (
    <>
      <h1 className="font-bold text-4xl">Documentos</h1>

      <section className="flex flex-col gap-10 mt-10">
        <BoletaCampoRMP boleta={boleta} />
        {boleta.quality_doc_data && (
          <BoletasCalidad boleta={boleta} />
        )}

        {boleta.transport_data && (
          <InspeccionTransporte boleta={boleta} />
        )}
      </section>

    </>
  )
}
