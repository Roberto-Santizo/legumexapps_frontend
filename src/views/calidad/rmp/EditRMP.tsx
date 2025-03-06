import { useEffect, useState } from "react";
import Boleta_form2 from "./Boleta_form2";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BoletaDetail } from "@/types";
import Spinner from "@/components/Spinner";
import Boleta_form3 from "./Boleta_form3";

import { getBoletaRMPDetail } from "@/api/ReceptionsDocAPI";



export default function EditRMP() {
  const { rm_reception_id } = useParams();
  
  const [boleta, setBoleta] = useState<BoletaDetail>({} as BoletaDetail);
  const [loading, setLoading] = useState<boolean>(true);
  
  const forms: { [key: number]: JSX.Element } = {
    1: <Boleta_form2 boleta={boleta}/>,
    2: <Boleta_form3 boleta={boleta}/>
  }
  const handleGetInfo = async () => {
    try {
      if (rm_reception_id) {
        const data = await getBoletaRMPDetail(rm_reception_id);
        setBoleta(data);
      }
    } catch (error) {
      toast.error('Hubo un error al traer la información')
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetInfo();
  }, [])

  return (
    <>
      <h2 className="font-bold text-3xl">Recepción de Materia Prima</h2>
      {loading ? <Spinner /> : (
        <>
          {forms[boleta.quality_status_id]}
        </>
      )}

    </>
  )
}
