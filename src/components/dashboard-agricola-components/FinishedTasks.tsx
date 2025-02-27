import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FinishedTask } from "../../types";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";

import { getTasksFinished } from "@/api/DashboardAgricolaAPI";

export default function FinishedTasks() {
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<FinishedTask[]>([]);

  const handleGetInfo = async () => {
    setLoading(true);
    try {
      const tasks = await getTasksFinished();
      setTasks(tasks);
    } catch (error) {
      toast.error("Hubo un error al traer la información");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetInfo();
  }, []);
  return (
    <div className="flex flex-col items-center shadow-xl row-start-4 col-start-1 col-span-12 rounded-xl gap-5">
      <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
        Control de tareas terminadas
      </p>

      {(!loading && tasks.length === 0) && (<p className="text-center mt-1">No hay datos</p>)}
      <div className="w-full p-2">
        {(loading) ? (
          <Spinner />
        ) : (
          <>{tasks.length > 0 && (
            <div className="max-h-64 overflow-y-auto">
              <table className="table w-full">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr className="thead-tr">
                    <th scope="col" className="thead-th"></th>
                    <th scope="col" className="thead-th">TAREA</th>
                    <th scope="col" className="thead-th">FINCA</th>
                    <th scope="col" className="thead-th">LOTE</th>
                    <th scope="col" className="thead-th">FECHA DE INICIO</th>
                    <th scope="col" className="thead-th">FECHA DE CIERRE</th>
                    <th scope="col" className="thead-th">ACCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr className="tbody-tr" key={task.id}>
                      <td></td>
                      <td className="tbody-td">{task.task}</td>
                      <td className="tbody-td">{task.finca}</td>
                      <td className="tbody-td">{task.lote}</td>
                      <td className="tbody-td">{task.start_date}</td>
                      <td className="tbody-td">{task.end_date}</td>
                      <td>
                        <Link
                          to={`/planes-semanales/tareas-lote/informacion/${task.id}`}
                          target="_blank"
                        >
                          <Eye />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}</>

        )}
      </div>
    </div>
  );
}
