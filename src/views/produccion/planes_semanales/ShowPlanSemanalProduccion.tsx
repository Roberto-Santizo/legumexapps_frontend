import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { downloadPlanillaProduction, getWeeklyPlanDetails } from "@/api/WeeklyProductionPlanAPI";
import { Eye, FileDown } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "react-toastify";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import ModalCargaPosiciones from "@/components/modals/ModalCargaPosiciones";
import LoadingOverlay from "@/components/utilities-components/LoadingOverlay";


export default function ShowPlanSemanalProduccion() {
  const params = useParams();
  const id = params.plan_id!!;
  const navigate = useNavigate();

  const { hasPermission } = usePermissions();

  const { mutate, isPending } = useMutation({
    mutationFn: downloadPlanillaProduction,
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { data: assignments, isLoading, isError } = useQuery({
    queryKey: ['getWeeklyPlanDetails', id],
    queryFn: () => getWeeklyPlanDetails(id)
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (assignments) return (
    <div className="w-full">
      {isPending && <LoadingOverlay />}
      <h2 className="font-bold text-xl text-center xl:text-left xl:text-4xl mb-12 text-gray-800">Líneas Asignadas</h2>

      {hasPermission('upload task production employees') && (
        <div className="flex justify-end mb-5">
          <button className="button bg-indigo-500 hover:bg-indigo-600" onClick={() => navigate(`${location.pathname}?uploadPositions=true`)}>
            <p>Cargar Posiciones</p>
          </button>
        </div>
      )}

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr className="thead-tr">
              <th className="thead-th">Linea</th>
              <th className="thead-th">Acción</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(line => (
              <tr className="tbody-tr" key={line.id}>
                <td className="tbody-td">{line.line}</td>
                {line.status ? (
                  <td className="tbody-td">
                    <div className="flex items-center gap-4">
                      {hasPermission('see tasks production') && (
                        <Link
                          to={`/planes-produccion/${id}/${line.id}`}
                          className="hover:text-gray-100 cursor-pointer"
                          title="Ver tareas"
                        >
                          <Eye className="text-gray-700 w-6 h-6" />
                        </Link>
                      )}

                      {hasPermission('download hours line report') && (
                        <button
                          onClick={() => mutate({ plan_id: id, line_id: line.id })}
                          className="hover:text-gray-100 cursor-pointer"
                          title="Descargar reporte"
                        >
                          <FileDown className="text-gray-700 w-6 h-6" />
                        </button>
                      )}
                    </div>
                  </td>
                ) : (
                  <td className="tbody-td"></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalCargaPosiciones />
    </div>

  )
}







