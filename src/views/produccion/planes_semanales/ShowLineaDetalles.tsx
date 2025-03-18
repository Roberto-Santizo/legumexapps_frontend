import { useQuery } from "@tanstack/react-query";
import { getWeeklyPlanLineDetails } from "@/api/WeeklyProductionPlanAPI";
import Spinner from "@/components/Spinner";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import { useParams } from "react-router-dom";
import { formatDate } from "@/helpers";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";


export default function ShowLineaDetalles() {
  const params = useParams();
  const plan_id = params.plan_id!!;
  const linea_id = params.linea_id!!;

  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['getWeeklyPlanLineDetails', plan_id, linea_id],
    queryFn: () => getWeeklyPlanLineDetails(linea_id, plan_id)
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (tasks) return (
    <>
      <h1 className="text-4xl font-bold mb-10">Tareas en proceso</h1>

      {tasks.map(task => (
        <div key={task.id} className="p-5 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <p>Fecha: {formatDate(task.operation_date)}</p>
              <p>Total tarimas: {task.total_tarimas}</p>
            </div>

            <div>
              <Link to={`/planes-produccion/${plan_id}/${linea_id}}/${task.id}`}>
                <Eye className="cur" />
              </Link>
            </div>
          </div>
        </div>

      ))}
    </>
  )
}
