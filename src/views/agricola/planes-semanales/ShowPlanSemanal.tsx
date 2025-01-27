import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";

export default function ShowPlanSemanal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const loadingFetchPlan = useAppStore((state) => state.loadingFetchPlan);
  const errorFetchPlan = useAppStore((state) => state.errorFetchPlan);
  const getPlan = useAppStore((state) => state.getPlan);
  const plan = useAppStore((state) => state.weeklyPlan);
  useEffect(() => {
    if (id) {
      getPlan(id);
    }
  }, []);

  return (
    <>
      {loadingFetchPlan && <Spinner />}
      {errorFetchPlan && <ShowErrorAPI />}
      {!loadingFetchPlan && !errorFetchPlan && plan?.data && (
        <div className="space-y-10">
          <h2 className="text-4xl font-bold">
            Plan Semanal {plan.data.finca} Semana {plan.data.week} -{" "}
            {plan.data.year}
          </h2>
          <div>
            <h2 className="text-xl font-bold uppercase">Tareas Generales</h2>
            <table className="table mt-10">
              <thead className="bg-gray-400">
                <tr className="text-xs md:text-sm rounded">
                  <th scope="col" className="table-header">
                    Lote
                  </th>
                  <th scope="col" className="table-header">
                    Personas
                  </th>
                  <th scope="col" className="table-header">
                    Presupuesto
                  </th>
                  <th scope="col" className="table-header">
                    Horas
                  </th>
                  <th scope="col" className="table-header">
                    Control de tareas
                  </th>
                  <th scope="col" className="table-header">
                    Tareas
                  </th>
                </tr>
              </thead>
              <tbody className="table-body">
                {plan.data.summary_tasks.map((task, index) => (
                  <tr className="even:bg-gray-100 shadow" key={index}>
                    <td className="record">{task.lote}</td>
                    <td className="record">{task.total_workers}</td>
                    <td className="record text-green-500 font-bold">{`Q${task.total_budget}`}</td>
                    <td className="record">{task.total_hours}</td>
                    <td className="record">{`${task.finished_tasks}/${task.total_tasks}`}</td>
                    <td className="record w-1/6">
                      <button
                        onClick={() =>
                          navigate(
                            `/planes-semanales/tareas-lote/${id}/${task.lote_plantation_control_id}`
                          )
                        }
                        className="button bg-gray-400 hover:bg-gray-500"
                      >
                        <p>Ver Tareas de Lote</p>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {plan.data.summary_crops.length > 0 && (
            <div>
              <h2 className="text-xl font-bold uppercase">
                Cosechas Asignadas
              </h2>
              <table className="table mt-10">
                <thead className="bg-gray-400">
                  <tr className="text-xs md:text-sm rounded">
                    <th scope="col" className="table-header">
                      Lote
                    </th>
                    <th scope="col" className="table-header">
                      Accion
                    </th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {plan.data.summary_crops.map((task, index) => (
                    <tr className="even:bg-gray-100 shadow" key={index}>
                      <td className="record">{task.lote}</td>
                      <td className="record w-1/6">
                        <button
                          onClick={() =>
                            navigate(
                              `/planes-semanales/tareas-cosecha-lote/${id}/${task.lote_plantation_control_id}`
                            )
                          }
                          className="button bg-gray-400 hover:bg-gray-500"
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
      )}
    </>
  );
}
