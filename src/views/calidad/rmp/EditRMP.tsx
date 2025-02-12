import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import Boleta_form2 from "./Boleta_form2";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BoletaDetail } from "../../../types";
import Spinner from "../../../components/Spinner";

export default function EditRMP() {
  const { rm_reception_id } = useParams();
  
  const getBoletaRMPDetail = useAppStore((state) => state.getBoletaRMPDetail);
  const [boleta, setBoleta] = useState<BoletaDetail>({} as BoletaDetail);
  const [loading, setLoading] = useState<boolean>(true);
  
  const forms: { [key: number]: JSX.Element } = {
    1: <Boleta_form2 boleta={boleta}/>
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
          {forms[boleta.status]}
        </>
      )}

    </>
  )
}
