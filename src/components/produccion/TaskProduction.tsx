import { AlarmClockPlus, CheckCircle, Eye, NotebookPen, Paperclip, SquarePlay, UserRoundX } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeTaskTimeOut } from "@/api/TimeOutsAPI";
import { toast } from "react-toastify";
import { TaskProductionPlan } from "types/taskProductionPlanTypes";
import { startTaskProductionPlan } from "@/api/TaskProductionPlansAPI";
import TaskLabel from "@/components/utilities-components/TaskLabel";
import { useMemo } from "react";
import Spinner from "../utilities-components/Spinner";
import { usePermissions } from "@/hooks/usePermissions";

type Props = {
  task: TaskProductionPlan;
  isFetching: boolean;
};

export default function TaskProduction({ task, isFetching }: Props) {
  const params = useParams();
  const plan_id = params.plan_id!!;
  const linea_id = params.linea_id!!;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { hasPermission } = usePermissions();

  const { mutate, isPending: closeTaskTimeOutPending } = useMutation({
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

  const { mutate: startTask, isPending: startTaskPending } = useMutation({
    mutationFn: startTaskProductionPlan,
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

  const isUpdating = useMemo(() => startTaskPending || closeTaskTimeOutPending || isFetching, [isFetching, startTaskPending, closeTaskTimeOutPending]);

  return (
    <div className="grid grid-cols-6 gap-8 shadow-xl rounded-2xl bg-white p-10 text-base sm:text-lg md:text-xl">
      <div className="col-span-6 md:col-span-5">
        <TaskLabel label="SKU" text={task.sku} />
        <TaskLabel label="Producto" text={task.product} />
        <TaskLabel label="Total de Libras" text={task.total_lbs.toString()} />
        <TaskLabel label="Fecha de Operación" text={task.operation_date} />
        <TaskLabel label="Línea" text={task.line} />
        <TaskLabel
          label="Fecha de Inicio"
          text={task.start_date || "SIN FECHA DE INICIO"}
        />
        <TaskLabel
          label="Fecha de Cierre"
          text={task.end_date || "SIN FECHA DE CIERRE"}
        />

        <div className="mt-6">
          <span className="inline-block bg-sky-500 text-white px-4 py-2 font-semibold shadow">
            {task.total_in_employees}/{task.total_employees} empleados
          </span>
        </div>
      </div>

      <div className="col-span-6 md:col-span-1 flex flex-col justify-between items-center space-y-6">
        {isUpdating ? (<Spinner />) : (
          <div className="flex flex-col gap-5 items-center">
            {task.status === 2 && (
              <button
                onClick={() =>
                  navigate(
                    `/planes-produccion/asignacion/${plan_id}/${linea_id}/${task.id}`,
                    { state: { url: location.pathname } }
                  )
                }
              >
                <Paperclip className="w-6 h-6 text-gray-700 hover:text-gray-500 transition" />
              </button>
            )}

            {!(task.start_date) && (
              <SquarePlay
                onClick={() => startTask(task.id)}
                className="w-6 h-6 text-gray-700 hover:text-gray-500 cursor-pointer transition"
              />
            )}

            {task.status === 4 && !task.paused && (
              <>
                <CheckCircle
                  onClick={() =>
                    navigate(`${location.pathname}?modal=1&TaskId=${task.id}`)
                  }
                  className="w-6 h-6 text-green-600 hover:text-gray-500 cursor-pointer transition"
                />
                <Link to={`/planes-produccion/informacion/${task.id}`}>
                  <Eye className="w-6 h-6 text-gray-700 hover:text-gray-500 transition" />
                </Link>
                <NotebookPen
                  onClick={() =>
                    navigate(`${location.pathname}?modal=2&TaskId=${task.id}`)
                  }
                  className="w-6 h-6 text-blue-600 hover:text-gray-500 cursor-pointer transition"
                />
                <AlarmClockPlus
                  onClick={() =>
                    navigate(`${location.pathname}?modal=3&TaskId=${task.id}`)
                  }
                  className="w-6 h-6 text-indigo-500 hover:text-gray-500 cursor-pointer transition"
                />
                <UserRoundX
                  onClick={() =>
                    navigate(`${location.pathname}?modal=5&TaskId=${task.id}`)
                  }
                  className="w-6 h-6 text-red-500 hover:text-gray-500 cursor-pointer transition"
                />
              </>
            )}

            {task.paused && task.status === 4 && (
              <>
                <AlarmClockPlus
                  onClick={() => mutate(task.id)}
                  className="w-6 h-6 text-orange-500 hover:text-orange-600 cursor-pointer transition"
                />
                <Link to={`/planes-produccion/informacion/${task.id}`}>
                  <Eye className="w-6 h-6 text-gray-700 hover:text-gray-500 transition" />
                </Link>
              </>
            )}

            {task.start_date && task.end_date && task.status === 5 && (
              <>
                <CheckCircle className="w-6 h-6 text-green-500" />
                <Link to={`/planes-produccion/tarea-produccion/${task.id}`}>
                  <Eye className="w-6 h-6 text-gray-700 hover:text-gray-500 transition" />
                </Link>
              </>
            )}

            {hasPermission('justify task performance') && (
              <>
                {task.end_date &&
                  !task.is_minimum_requrire &&
                  !task.is_justified &&
                  task.status === 5 && (
                    <NotebookPen
                      onClick={() =>
                        navigate(`${location.pathname}?modal=4&TaskId=${task.id}`)
                      }
                      className="w-6 h-6 text-red-500 hover:text-gray-500 cursor-pointer transition"
                    />
                  )}
              </>
            )}

          </div>
        )}

      </div>
    </div>

  );
}
