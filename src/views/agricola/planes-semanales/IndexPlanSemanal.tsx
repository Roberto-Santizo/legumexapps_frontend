//HOOKS
import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";

//COMPONENTES
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import Spinner from "../../../components/Spinner";
import { Link } from "react-router-dom";
import { PlusIcon, Sheet } from "lucide-react";
import { WeeklyPlan } from "../../../types";

export default function IndexPlanSemanal() {

  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);

  const getAllPlans = useAppStore((state) => state.getAllPlans);
  const loading = useAppStore((state) => state.loadinggetAllPlans);
  const error = useAppStore((state) => state.errorgetAllPlans);

  useEffect(() => {
    getAllPlans().then((plans) => setWeeklyPlans(plans));
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
          <thead>
            <tr className="thead-tr">
              <th scope="col" className="thead-th">
                Finca
              </th>
              <th scope="col" className="thead-th">
                Semana
              </th>
              <th scope="col" className="thead-th">
                Año
              </th>
              <th scope="col" className="thead-th">
                Fecha de Creación
              </th>
              <th scope="col" className="thead-th">
                Control de Presupuesto
              </th>
              <th scope="col" className="thead-th">
                Monto Extraordinario
              </th>
              <th scope="col" className="thead-th">
                Control de Tareas
              </th>
              <th scope="col" className="thead-th">
                Control de tareas Cosecha
              </th>
              <th scope="col" className="thead-th">
                Tareas
              </th>
              <th scope="col" className="thead-th">
                Reporte General
              </th>
              <th scope="col" className="thead-th">
                Planilla Semanal
              </th>
              <th scope="col" className="thead-th">
                Reporte de Insumos
              </th>
            </tr>
          </thead>
          <tbody>
            {weeklyPlans.map((plan) => (
              <tr className="tbody-tr" key={plan.id}>
                <td className="tbody-td">{plan.finca}</td>
                <td className="tbody-td">{plan.week}</td>
                <td className="tbody-td">{plan.year}</td>
                <td className="tbody-td">{plan.created_at}</td>
                <td className="tbody-td font-bold text-green-500">
                  {`Q${plan.used_budget}/${plan.total_budget}`}
                </td>
                <td className="tbody-td font-bold text-green-500">
                  {`Q${plan.used_total_budget_ext}/${plan.total_budget_ext}`}
                </td>
                <td className="tbody-td">
                  {`${plan.finished_total_tasks}/${plan.total_tasks}`}
                </td>
                <td className="tbody-td">{plan.tasks_crop}</td>
                <td className="tbody-td w-1/5">
                  <Link
                     to={`/planes-semanales/${plan.finca}/${plan.id}`}
                    className="button bg-indigo-500 hover:bg-indigo-600 w-auto"
                  >
                    Tareas del Plan
                  </Link>
                </td>
                <td className="tbody-td">
                  <Link
                    to={"/tareas-semanales"}
                    title="Reporte de Tareas General"
                  >
                    <Sheet className="hover:text-gray-400" />
                  </Link>
                </td>
                <td className="tbody-td">
                  <Link to={"/tareas-semanales"} title="Planilla Semanal">
                    <Sheet className="hover:text-gray-400" />
                  </Link>
                </td>
                <td className="tbody-td">
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
