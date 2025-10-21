import { useNavigate, useParams } from "react-router-dom";
import { getSummaryTasksCropLote, getSummaryTasksLote } from "@/api/WeeklyPlansAPI";
import { usePermissions } from "@/hooks/usePermissions";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

export default function Show() {
  const params = useParams();
  const id = params.id!;
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const { data: summaryPlan, isLoading, isError } = useQuery({
    queryKey: ['getPlanById', id],
    queryFn: () => getSummaryTasksLote(id)
  });
  const { data: summaryPlanCrop } = useQuery({
    queryKey: ['getSummaryTasksCropLote', id],
    queryFn: () => getSummaryTasksCropLote(id)
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />

  if (summaryPlan && summaryPlanCrop) return (
    <>
      <div className="space-y-10">
        {summaryPlan.data.length === 0 ? (
          <p className="text-center text-xl">No existen tareas programadas el día de hoy</p>
        ) : (
          <div className="table-wrapper">
            <h1 className="font-bold text-4xl">Tareas Generales</h1>
            <table className="table mt-10">
              <thead>
                <tr className="thead-tr">
                  <th scope="col" className="thead-th">
                    Lote
                  </th>
                  <th scope="col" className="thead-th">
                    Personas
                  </th>
                  {hasPermission('see budget') && (
                    <th scope="col" className="thead-th">
                      Presupuesto
                    </th>
                  )}

                  <th scope="col" className="thead-th">
                    Horas
                  </th>
                  <th scope="col" className="thead-th">
                    Control de tareas
                  </th>
                  <th scope="col" className="thead-th">
                    Tareas
                  </th>
                </tr>
              </thead>
              <tbody>
                {summaryPlan.data.map((task, index) => (
                  <tr className="tbody-tr" key={index}>
                    <td className="tbody-td">{task.lote}</td>
                    <td className="tbody-td">{task.total_workers}</td>
                    {hasPermission('see budget') && (
                      <td className="tbody-td text-green-500 font-bold">{`Q${task.total_budget}`}</td>
                    )}
                    <td className="tbody-td">{task.total_hours}</td>
                    <td className="tbody-td">{`${task.finished_tasks}/${task.total_tasks}`}</td>
                    <td className="tbody-td w-1/6">
                      <button
                        onClick={() => navigate(`/planes-semanales/tareas-lote/${id}/${task.lote}`)}
                        className="button bg-indigo-500 hover:bg-indigo-600"
                      >
                        <p>Ver Tareas de Lote</p>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {summaryPlanCrop.data.length === 0 ? (
          <p className="text-center text-xl">No existen cosechas</p>
        ) : (
          <div className="table-wrapper">
            <h1 className="font-bold text-4xl">Cosechas</h1>
            <table className="table mt-10">
              <thead>
                <tr className="thead-tr">
                  <th scope="col" className="thead-th">
                    Lote
                  </th>
                  <th scope="col" className="thead-th">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {summaryPlanCrop.data.map((task, index) => (
                  <tr className="tbody-tr" key={index}>
                    <td className="tbody-td">{task.lote}</td>
                    <td className="tbody-td w-1/6">
                      <button
                        onClick={() => navigate(`/planes-semanales/tareas-cosecha-lote/${id}/${task.cdp_id}`)}
                        className="button bg-indigo-500 hover:bg-indigo-600"
                      >
                        <p>Ver Cosecha Lote</p>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </>
  );
}
