import { AlarmClockPlus, CheckCircle, Eye, NotebookPen, Paperclip, UserRoundX } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TaskByLine } from "@/api/WeeklyProductionPlanAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeTaskTimeOut } from "@/api/TimeOutsAPI";
import { toast } from "react-toastify";
import TaskLabel from "@/components/utilities-components/TaskLabel";

type Props = {
  task: TaskByLine;
};
export default function TaskProduction({ task }: Props) {
  const params = useParams();
  const plan_id = params.plan_id!!;
  const linea_id = params.linea_id!!;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: closeTaskTimeOut,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({
        queryKey: ["getTasksByLineId", plan_id, linea_id],
      });
    },
  });
  return (
    <div
      className="grid grid-cols-6 shadow-xl p-10 text-xl"
    >
      <div className="col-span-5">
        <TaskLabel label={"ID"} text={task.id} />
        <TaskLabel label={"SKU"} text={task.sku} />
        <TaskLabel label={"Producto"} text={task.product} />
        <TaskLabel
          label={"Total de Libras"}
          text={task.total_lbs.toString()}
        />
        <TaskLabel label={"Fecha de Operación"} text={task.operation_date} />
        <TaskLabel
          label={"Fecha de Inicio"}
          text={task.start_date ? task.start_date : "SIN FECHA DE INICIO"}
        />
        <TaskLabel
          label={"Fecha de Cierre"}
          text={task.end_date ? task.end_date : "SIN FECHA DE INICIO"}
        />
        <div className="mt-5 flex">
          <p className="bg-sky-400 p-2 text-white rounded font-bold">
            {task.total_in_employees}/{task.total_employees}
          </p>
        </div>
      </div>

      <div className="col-start-7 space-y-5 flex flex-col justify-between items-center">
        <div className="flex flex-col gap-5">
          {task.paused && (
            <>
              <AlarmClockPlus
                className="hover:text-orange-600 cursor-pointer text-orange-500"
                onClick={() => {
                  mutate(task.id);
                }}
              />

              <Link to={`/planes-produccion/informacion/${task.id}`}>
                <Eye className="cursor-pointer hover:text-gray-500" />
              </Link>
            </>
          )}

          {task.start_date && !task.end_date && !task.paused && (
            <>
              <CheckCircle
                className="hover:text-gray-500 cursor-pointer"
                onClick={() => navigate(`${location.pathname}?modal=1&TaskId=${task.id}`)}
              />

              <Link to={`/planes-produccion/informacion/${task.id}`}>
                <Eye className="cursor-pointer hover:text-gray-500" />
              </Link>

              <NotebookPen
                className="hover:text-gray-500 cursor-pointer"
                onClick={() => navigate(`${location.pathname}?modal=2&TaskId=${task.id}`)}
              />

              <AlarmClockPlus
                className="hover:text-gray-500 cursor-pointer"
                onClick={() => navigate(`${location.pathname}?modal=3&TaskId=${task.id}`)}
              />

              <UserRoundX
                className="hover:text-gray-500 cursor-pointer"
                onClick={() => navigate(`${location.pathname}?modal=5&TaskId=${task.id}`)}
              />
            </>
          )}

          {!task.start_date && (
            <button onClick={() => navigate(`/planes-produccion/asignacion/${plan_id}/${linea_id}/${task.id}`, { state: { url: location.pathname } })}>
              <Paperclip className="cursor-pointer hover:text-gray-500" />
            </button>
          )}

          {task.start_date && task.end_date && (
            <>
              <CheckCircle className="text-green-500 cursor-pointer" />
              <Link to={`/planes-produccion/tarea-produccion/${task.id}`}>
                <Eye className="cursor-pointer hover:text-gray-500" />
              </Link>
            </>
          )}

          {(task.end_date && !task.is_minimum_requrire && !task.is_justified) && (
            <NotebookPen
              className="text-red-500 hover:text-gray-500 cursor-pointer"
              onClick={() => navigate(`${location.pathname}?modal=4&TaskId=${task.id}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
