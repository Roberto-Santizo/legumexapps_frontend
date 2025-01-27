import {
  CircleCheck,
  CirclePause,
  Edit,
  Eraser,
  Info,
  PlayCircleIcon,
  SquarePlusIcon,
  TrashIcon,
} from "lucide-react";
import { useAppStore } from "../stores/useAppStore";
import { TaskWeeklyPlan } from "../types";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { formatDate } from "../helpers";
import TaskLabel from "./TaskLabel";

type TaskProps = {
  task: TaskWeeklyPlan;
};

export default function Task({ task }: TaskProps) {
  const { weekly_plan_id } = useParams()

  //ASYNC FUNCTIONS
  const createPartialClosure = useAppStore((state) => state.createPartialClosure);
  const closePartialClosure = useAppStore((state) => state.closePartialClosure);
  const closeTask = useAppStore((state) => state.closeTask);
  const cleanTask = useAppStore((state) => state.cleanTask);
  const reloadTasks = useAppStore((state) => state.reloadTasks);
  const getTasks = useAppStore((state) => state.getTasks);
  const deteleteTask = useAppStore((state) => state.deteleteTask);

  //STATES
  const navigate = useNavigate();
  const loadingUpdateTask = useAppStore((state) => state.loadingUpdateTask);
  const userRole = useAppStore((state) => state.userRole);
  const weeklyPlan = useAppStore((state) => state.weeklyPlan);


  const handleClickCreatePartialClosure = async (
    idTask: TaskWeeklyPlan["id"]
  ) => {
    await createPartialClosure(idTask);
    if (task.lote_plantation_control_id, weekly_plan_id) {
      await reloadTasks(task.lote_plantation_control_id, weekly_plan_id);
    }
    toast.success("Tarea cerrada parcialmente");
  };

  const handleClickClosePartialClosure = async (
    idTask: TaskWeeklyPlan["id"]
  ) => {
    await closePartialClosure(idTask);
    if (task.lote_plantation_control_id, weekly_plan_id) {
      await reloadTasks(task.lote_plantation_control_id, weekly_plan_id);
    }
    toast.success("Tarea reabierta");
  };

  const handleCloseTask = async (idTask: TaskWeeklyPlan["id"]) => {
    await closeTask(idTask);
    if (task.lote_plantation_control_id, weekly_plan_id) {
      await reloadTasks(task.lote_plantation_control_id, weekly_plan_id);
    }
    toast.success("Tarea Cerrada Correctamente");
  };

  const handleDeleteTask = async (idTask: TaskWeeklyPlan["id"]) => {
    Swal.fire({
      title: "¿Desea eliminar la tarea?",
      text: `La tarea no se podra recuperar`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar Tarea",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          deteleteTask(idTask);
          toast.success("Tarea Eliminada correctamente");

          (async () => {
            if (task.lote_plantation_control_id) {
              await getTasks(task.lote_plantation_control_id, weeklyPlan.data.id);
            }
          })();
        } catch (error) {
          toast.error("Hubo un error al cerrar la asignación");
        }
      }
    });
  };

  const handleEraseTask = async (idTask: TaskWeeklyPlan["id"]) => {
    Swal.fire({
      title: "¿Desea limpiar la asignación de esta tarea?",
      text: `La asignación no se podra recuperar`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Limpiar Tarea",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          cleanTask(idTask);
          toast.success("Asignación Eliminada Correctamente");

          (async () => {
            if (task.lote_plantation_control_id) {
              await getTasks(task.lote_plantation_control_id, weeklyPlan.data.id);
            }
          })();
        } catch (error) {
          toast.error("Hubo un error al cerrar la asignación");
        }
      }
    });
  };

  return (
    <div className="grid grid-cols-6 shadow-xl p-10 text-xl">
      <div className="col-span-5">
        <TaskLabel label={'ID'} text={task.id} />
        <TaskLabel label={'Semana'} text={task.week.toString()} />
        <TaskLabel label={'Horas Teoricas'} text={task.hours.toString()} />
        <TaskLabel label={'Tarea'} text={task.task} />
        <TaskLabel label={'Presupuesto'} text={`Q${task.budget.toString()}`} text_classes="text-green-500 font-bold" />
        <TaskLabel label={'Fecha de Asignación'} text={task.start_date ? formatDate(task.start_date) : "Sin asignación"} />
        <TaskLabel label={'Fecha de Cierre'} text={task.end_date ? formatDate(task.end_date) : "Sin cierre"} />
      </div>

      <div className="col-start-7 space-y-5">
        {loadingUpdateTask ? (
          <Spinner />
        ) : (
          <>
            {!task.start_date && !task.end_date && !task.active_closure && (
              <>
                <SquarePlusIcon
                  className="cursor-pointer hover:text-gray-400"
                  onClick={() =>
                    navigate(`/planes-semanales/tareas-lote/asignar/${task.finca_id}/${task.id}`, {
                      state: {
                        previousUrl: window.location.pathname
                      }
                    })
                  }
                />
                {(userRole === "admin" || userRole === "adminagricola") && (
                  <TrashIcon
                    className="cursor-pointer hover:text-red-400"
                    onClick={() => handleDeleteTask(task.id)}
                  />
                )}
              </>
            )}

            {task.start_date && !task.end_date && !task.active_closure && (
              <>
                <CircleCheck
                  className="cursor-pointer hover:text-green-400"
                  onClick={() => handleCloseTask(task.id)}
                />
                <Info
                  className="cursor-pointer hover:text-gray-400"
                  onClick={() => {
                    navigate(`/planes-semanales/tareas-lote/informacion/${task.id}`, {
                      state: {
                        previousUrl: window.location.pathname,
                      },
                    });
                  }}
                />
                <CirclePause
                  className="cursor-pointer text-orange-500 hover:text-orange-800"
                  onClick={() => handleClickCreatePartialClosure(task.id)}
                />

                {(userRole === "admin" || userRole === "adminagricola") && (
                  <Eraser className="cursor-pointer text-red-500 hover:text-red-800" onClick={() => handleEraseTask(task.id)} />
                )}
              </>
            )}
            {task.active_closure && (
              <PlayCircleIcon
                className="cursor-pointer text-green-500 hover:text-green-400"
                onClick={() => handleClickClosePartialClosure(task.id)}
              />
            )}

            {task.start_date && task.end_date && !task.active_closure && (
              <>
                <CircleCheck className="cursor-pointer text-green-500 hover:text-green-400" />
                <Info
                  className="cursor-pointer hover:text-gray-400"
                  onClick={() => {
                    navigate(`/planes-semanales/tareas-lote/informacion/${task.id}`);
                  }}
                />
              </>
            )}

            {(userRole === "admin" || userRole === "adminagricola") && (
              <Edit className="cursor-pointer hover:text-gray-400" onClick={() => {
                navigate(`/planes-semanales/tareas-lote/editar/${task.id}`, {
                  state: {
                    previousUrl: window.location.pathname
                  }
                })
              }} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
