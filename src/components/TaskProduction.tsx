import { AlarmClockPlus, CheckCircle, Eye, NotebookPen, Paperclip } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TaskByLine } from "@/api/WeeklyProductionPlanAPI";
import { Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TaskLabel from "./TaskLabel";
import { closeTaskTimeOut } from "@/api/TimeOutsAPI";
import { toast } from "react-toastify";

type Props = {
  task: TaskByLine;
  setSelectedTask: Dispatch<SetStateAction<TaskByLine>>;
  setModalCierre: Dispatch<React.SetStateAction<boolean>>;
  setModalRendimiento: Dispatch<React.SetStateAction<boolean>>;
  setModalTimeOut: Dispatch<React.SetStateAction<boolean>>;
  setModalNotas: Dispatch<React.SetStateAction<boolean>>;
  modalCierre: boolean;
};
export default function TaskProduction({ task, setSelectedTask, setModalCierre, setModalRendimiento, setModalTimeOut, setModalNotas }: Props) {
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
      className={`grid grid-cols-6 shadow-xl p-10 text-xl ${!task.available && "opacity-35 cursor-not-allowed"
        }`}
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
                onClick={() => {
                  setSelectedTask(task);
                  setModalCierre(true);
                }}
              />

              <Link to={`/planes-produccion/informacion/${task.id}`}>
                <Eye className="cursor-pointer hover:text-gray-500" />
              </Link>

              <NotebookPen
                className="hover:text-gray-500 cursor-pointer"
                onClick={() => {
                  setSelectedTask(task);
                  setModalRendimiento(true);
                }}
              />

              <AlarmClockPlus
                className="hover:text-gray-500 cursor-pointer"
                onClick={() => {
                  setSelectedTask(task);
                  setModalTimeOut(true);
                }}
              />
            </>
          )}

          {!task.start_date && task.available && (
            <button onClick={() => navigate(`/planes-produccion/asignacion/${task.id}`, { state: { url: location.pathname, plan_id: plan_id, linea_id: linea_id } })}>
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
              onClick={() => {
                setSelectedTask(task);
                setModalNotas(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
