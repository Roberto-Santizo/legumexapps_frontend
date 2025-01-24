import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import { SummaryWeeklyPlanType } from "../../../types";
import ReturnLink from "../../../components/utilities-components/ReturnLink";
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";

export default function ShowPlanSemanal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<SummaryWeeklyPlanType>({
    data: {
      finca: "",
      week: 0,
      year: 0,
      summary: [
        {
          lote: "",
          total_budget: 0,
          total_workers: 0,
          total_hours: 0,
          total_tasks: 0,
          finished_tasks: 0,
          lote_plantation_control_id: "",
        },
      ],
    },
  });
  const getPlan = useAppStore((state) => state.getPlan);
  const loadingFetchPlan = useAppStore((state) => state.loadingFetchPlan);
  const errorFetchPlan = useAppStore((state) => state.errorFetchPlan);
  const fetchPlan = async () => {
    if (id) {
      setPlan(await getPlan(id));
    }
  };
  useEffect(() => {
    fetchPlan();
  }, []);

  const goToDetailLote= (lote : string, lote_plantation_control_id: string) =>{
    navigate(`/tareas-lote/${lote}/${lote_plantation_control_id}`, {state: { previousUrl: window.location.pathname }})
  }

  return (
    <>
      {loadingFetchPlan && <Spinner />}
      {errorFetchPlan && <ShowErrorAPI />}
      {!loadingFetchPlan && !errorFetchPlan && (
        <>
          <h2 className="text-4xl font-bold">
            Plan Semanal {plan.data.finca} Semana {plan.data.week} -{" "}
            {plan.data.year}
          </h2>

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
              {plan.data.summary.map((task, index) => (
                <tr className="even:bg-gray-100 shadow" key={index}>
                  <td className="record">{task.lote}</td>
                  <td className="record">{task.total_workers}</td>
                  <td className="record text-green-500 font-bold">{`Q${task.total_budget}`}</td>
                  <td className="record">{task.total_hours}</td>
                  <td className="record">{`${task.finished_tasks}/${task.total_tasks}`}</td>
                  <td className="record w-1/6">
                    <button onClick={() => goToDetailLote(task.lote,task.lote_plantation_control_id)} className="button bg-gray-400 hover:bg-gray-500">
                      <p>
                        Ver Tareas de Lote
                      </p>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
