import { Eye } from "lucide-react";
import Spinner from "../utilities-components/Spinner";
import { Link } from "react-router-dom";
import { getTasksCropFinished } from "@/api/DashboardAgricolaAPI";
import { useQuery } from "@tanstack/react-query";
import ShowErrorAPI from "../utilities-components/ShowErrorAPI";


export default function FinishedTasksCrop() {
  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['getTasksCropFinished'],
    queryFn: getTasksCropFinished
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (tasks) return (
    <div className="flex flex-col items-center shadow-xl row-start-6 col-start-1 col-span-12 rounded-xl gap-5">
      <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
        Control de cosechas terminadas
      </p>

      {(tasks.length === 0) && (<p className="text-center mt-1">No hay datos</p>)}

      <div className="w-full p-2">
        {tasks.length > 0 && (
          <div className="max-h-64 overflow-y-auto">
            <table className="table w-full">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="thead-tr">
                  <th scope="col" className="thead-th"></th>
                  <th scope="col" className="thead-th">TAREA</th>
                  <th scope="col" className="thead-th">FINCA</th>
                  <th scope="col" className="thead-th">LOTE</th>
                  <th scope="col" className="thead-th">FECHA DE COSECHA</th>
                  <th scope="col" className="thead-th">ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="tbody-tr">
                    <td></td>
                    <td className="tbody-td">{task.task}</td>
                    <td className="tbody-td">{task.finca}</td>
                    <td className="tbody-td">{task.lote}</td>
                    <td className="tbody-td">{task.start_date}</td>
                    <td>
                      <Link to={`/planes-semanales/tareas-cosecha-lote/resumen/${task.id}`} target="_blank">
                        <Eye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
