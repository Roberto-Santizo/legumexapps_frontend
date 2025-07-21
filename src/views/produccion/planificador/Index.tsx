import ModalCreateDraftPlanProduction from "@/components/modals/ModalCreateDraftPlanProduction";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="font-bold text-center text-xl xl:text-left xl:text-4xl">Drafts Planificación Producción</h1>

      <div className="flex flex-row justify-end gap-5 mb-5">
        <div className="flex flex-row justify-end gap-5">
          <button
            onClick={() => navigate(`${location.pathname}?newDraftPlanification=true`)}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
          >
            <PlusIcon className="w-8" />
            <p>Iniciar Planificación</p>
          </button>
        </div>
      </div>

      <div className="mt-10 table-wrapper">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th className="thead-th">Año</th>
              <th className="thead-th">Semana</th>
              <th className="thead-th">Acción</th>
              <th className="thead-th">Fecha de Creación</th>
              <th className="thead-th">Fecha de Confirmación</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>

      <ModalCreateDraftPlanProduction />
    </>
  )
}
