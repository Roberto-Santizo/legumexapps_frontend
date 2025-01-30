import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import { SummaryWeeklyPlanType } from "../../../types";

export default function ShowPlanSemanal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [summaryPlan, setSummaryPlan] = useState<SummaryWeeklyPlanType>({} as SummaryWeeklyPlanType);
  const [loading,setLoading] = useState<boolean>(false);
  const [error,setError] = useState<boolean>(false);
  
  const getPlanById = useAppStore((state) => state.getPlanById);

  const handleGetPlanById = async () => {
    setLoading(true);
    try {
      if(id){
        const plan = await getPlanById(id);
        setSummaryPlan(plan);
      }
    } catch (error) {
      setError(true);
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetPlanById()
  }, []);


  return (
    <>
      {loading && <Spinner />}
      {error && <ShowErrorAPI />}
      {!loading && !error && summaryPlan?.data && (
        <div className="space-y-10">
          <h2 className="text-4xl font-bold">
            Plan Semanal {summaryPlan.data.finca} Semana {summaryPlan.data.week} -{" "}
            {summaryPlan.data.year}
          </h2>

          {summaryPlan.data.summary_tasks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold uppercase">Tareas Generales</h2>
              <table className="table mt-10">
                <thead>
                  <tr className="thead-tr">
                    <th scope="col" className="thead-th">
                      Lote
                    </th>
                    <th scope="col" className="thead-th">
                      Personas
                    </th>
                    <th scope="col" className="thead-th">
                      Presupuesto
                    </th>
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
                  {summaryPlan.data.summary_tasks.map((task, index) => (
                    <tr className="tbody-tr" key={index}>
                      <td className="tbody-td">{task.lote}</td>
                      <td className="tbody-td">{task.total_workers}</td>
                      <td className="tbody-td text-green-500 font-bold">{`Q${task.total_budget}`}</td>
                      <td className="tbody-td">{task.total_hours}</td>
                      <td className="tbody-td">{`${task.finished_tasks}/${task.total_tasks}`}</td>
                      <td className="tbody-td w-1/6">
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
          )}

          {summaryPlan.data.summary_crops.length > 0 && (
            <div>
              <h2 className="text-xl font-bold uppercase">
                Cosechas Asignadas
              </h2>
              <table className="table mt-10">
                <thead>
                  <tr className="thead-tr">
                    <th scope="col" className="thead-th">
                      Lote
                    </th>
                    <th scope="col" className="thead-th">
                      Accion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summaryPlan.data.summary_crops.map((task, index) => (
                    <tr className="tbody-tr" key={index}>
                      <td className="tbody-td">{task.lote}</td>
                      <td className="tbody-td w-1/6">
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
