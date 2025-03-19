import { useQuery } from "@tanstack/react-query";
import { getWeeklyPlanLineDetails, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import Spinner from "@/components/Spinner";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import { useParams } from "react-router-dom";
import { formatDate } from "@/helpers";
import { Link } from "react-router-dom";
import { Clock, Eye, NotebookPen, Paperclip } from "lucide-react";
import TaskLabel from "@/components/TaskLabel";
import { useState } from "react";
import ModalTomaRendimientoProduccion from "@/components/ModalTomaRendimientoProduccion";


export default function ShowLineaDetalles() {
  const params = useParams();
  const plan_id = params.plan_id!!;
  const linea_id = params.linea_id!!;

  const [modal,setModal]= useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TaskProduction>({} as TaskProduction);

  const { data: tasks, isLoading, isError } = useQuery({
    queryKey: ['getWeeklyPlanLineDetails', plan_id, linea_id],
    queryFn: () => getWeeklyPlanLineDetails(linea_id, plan_id)
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (tasks) return (
    <>
      <h1 className="text-4xl font-bold mb-10">Tareas Programadas</h1>

      {tasks.map(task => (
        <div className="grid grid-cols-6 shadow-xl p-10 text-xl" key={task.id}>
          <div className="col-span-5">
            <TaskLabel label={"SKU"} text={task.sku} />
            <TaskLabel label={"Total de Tarimas"} text={task.total_tarimas.toString()} />
            <TaskLabel label={"Fecha de Operación"} text={formatDate(task.operation_date)} />
            <TaskLabel label={"Fecha de Inicio"} text={task.start_date ? task.start_date : 'SIN FECHA DE INICIO'} />

            <div className="mt-5 flex">
              <p className="bg-sky-400 p-2 text-white rounded font-bold">{task.total_in_employees}/{task.total_employees}</p>
            </div>
          </div>
          
          <div className="col-start-7 space-y-5 flex flex-col justify-center items-center">
            {task.start_date && !task.end_date ? (
              <>
                <Link to={`/planes-produccion/informacion/${task.id}`}>
                  <Eye className="cursor-pointer hover:text-gray-500" />
                </Link>
                <Clock className="text-orange-500" />
                
                <NotebookPen className="hover:text-gray-500 cursor-pointer" onClick={() => {
                    setSelectedTask(task)
                    setModal(true);
                  }}/>
              </>
            ) : (
              <Link to={`/planes-produccion/asignacion/${task.id}`}>
                <Paperclip className="cursor-pointer hover:text-gray-500" />
              </Link>
            )}
          </div>
        </div>
      ))}

      {(modal) && (
        <ModalTomaRendimientoProduccion task={selectedTask} setModal={setModal} modal={modal} setSelectedTask={setSelectedTask}/>
      )}
    </>
  )
}
