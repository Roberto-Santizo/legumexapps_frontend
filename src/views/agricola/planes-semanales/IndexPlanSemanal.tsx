//HOOKS
import { useEffect } from "react";
import { useAppStore } from "../../../stores/useAppStore";

//COMPONENTES
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import Spinner from "../../../components/Spinner";
import { Link } from "react-router-dom";
import { PlusIcon, Sheet } from "lucide-react";

export default function IndexPlanSemanal() {
  const fetchWeeklyPlans = useAppStore((state) => state.fetchPlans);
  const loading = useAppStore((state) => state.loadingFetchPlans);
  const error = useAppStore((state) => state.errorFetchPlans);
  const plans = useAppStore((state) => state.weeklyPlans);

  useEffect(() => {
    fetchWeeklyPlans();
  }, []);
  return (
    <>
      <h2 className="font-bold text-4xl">Planes Semanales</h2>

      <div className="flex flex-row justify-end gap-5">
        <Link
          to="/planes-semanales/crear"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
        >
          <PlusIcon className="w-8" />
          <p>Crear Plan Semanal</p>
        </Link>
      </div>

      {loading && <Spinner />}
      {!loading && error && <ShowErrorAPI />}
      {!loading && !error && (
        <table className="table mt-10">
          <thead className="bg-gray-400">
            <tr className="text-xs md:text-sm rounded">
              <th scope="col" className="table-header">
                Finca
              </th>
              <th scope="col" className="table-header">
                Semana
              </th>
              <th scope="col" className="table-header">
                Año
              </th>
              <th scope="col" className="table-header">
                Fecha de Creación
              </th>
              <th scope="col" className="table-header">
                Control de Presupuesto
              </th>
              <th scope="col" className="table-header">
                Monto Extraordinario
              </th>
              <th scope="col" className="table-header">
                Control de Tareas
              </th>
              <th scope="col" className="table-header">
                Control de tareas Cosecha
              </th>
              <th scope="col" className="table-header">
                Tareas
              </th>
              <th scope="col" className="table-header">
                Reporte General
              </th>
              <th scope="col" className="table-header">
                Planilla Semanal
              </th>
              <th scope="col" className="table-header">
                Reporte de Insumos
              </th>
            </tr>
          </thead>
          <tbody className="table-body">
            {plans.map((plan) => (
              <tr className="text-xl" key={plan.id}>
                <td className="record">{plan.finca}</td>
                <td className="record">{plan.week}</td>
                <td className="record">{plan.year}</td>
                <td className="record">{plan.created_at}</td>
                <td className="record font-bold text-green-500">
                  {`Q${plan.used_budget}/${plan.total_budget}`}
                </td>
                <td className="record font-bold text-green-500">
                  {`Q${plan.used_total_budget_ext}/${plan.total_budget_ext}`}
                </td>
                <td className="record">
                  {`${plan.finished_total_tasks}/${plan.total_tasks}`}
                </td>
                <td className="record">{plan.tasks_crop}</td>
                <td className="record w-1/5">
                  <Link
                     to={`/planes-semanales/${plan.finca}/${plan.id}`}
                    className="button bg-indigo-500 hover:bg-indigo-600 w-auto"
                  >
                    Tareas del Plan
                  </Link>
                </td>
                <td className="record">
                  <Link
                    to={"/tareas-semanales"}
                    title="Reporte de Tareas General"
                  >
                    <Sheet className="hover:text-gray-400" />
                  </Link>
                </td>
                <td className="record">
                  <Link to={"/tareas-semanales"} title="Planilla Semanal">
                    <Sheet className="hover:text-gray-400" />
                  </Link>
                </td>
                <td className="record">
                  <Link to={`/planes-semanales/${plan.id}`} title="Reporte de Insumos">
                    <Sheet className="hover:text-gray-400" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
