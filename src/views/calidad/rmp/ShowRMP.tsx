import BoletaCampoRMP from "@/components/boleta-rmp/BoletaCampoRMP"
import BoletasCalidad from "@/components/boleta-rmp/BoletasCalidad"
import Spinner from "@/components/Spinner";
import { BoletaInfoAll } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getBoletaInfoAll } from "@/api/ReceptionsDocAPI";

export default function ShowRMP() {
  const { rm_reception_id } = useParams();

  const [boleta, setBoleta] = useState<BoletaInfoAll>({} as BoletaInfoAll);
  const [loading, setLoading] = useState<boolean>(true);

  const handleGetInfo = async () => {
    setLoading(true);
    try {
      if (rm_reception_id) {
        const data = await getBoletaInfoAll(rm_reception_id);
        setBoleta(data);
      }
    } catch (error) {
      toast.error('Error al traer la información');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetInfo();
  }, []);

  return (
    <>
      <h1 className="font-bold text-4xl">Documentos</h1>

      {(loading && boleta)? <Spinner /> : (
        <section className="flex flex-col gap-10 mt-10">
          <BoletaCampoRMP boleta={boleta}/>
          {boleta.quality_doc_data && (
            <BoletasCalidad boleta={boleta}/>
          )}
        </section>
      )}

    </>
  )
}
