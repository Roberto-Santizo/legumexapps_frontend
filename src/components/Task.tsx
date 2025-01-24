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
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

type TaskProps = {
  task: TaskWeeklyPlan;
  id: string | undefined;
};

export default function Task({ task, id }: TaskProps) {
  const createPartialClosure = useAppStore(
    (state) => state.createPartialClosure
  );
  const closePartialClosure = useAppStore((state) => state.closePartialClosure);
  const closeTask = useAppStore((state) => state.closeTask);
  const cleanTask = useAppStore((state) => state.cleanTask);
  const reloadTasks = useAppStore((state) => state.reloadTasks);
  const fetchTasks = useAppStore((state) => state.fetchTasks);
  const loadingUpdateTask = useAppStore((state) => state.loadingUpdateTask);
  const deteleteTask = useAppStore((state) => state.deteleteTask);
  const userRole = useAppStore((state) => state.userRole);

  const navigate = useNavigate();

  const handleClickCreatePartialClosure = async (
    idTask: TaskWeeklyPlan["id"]
  ) => {
    await createPartialClosure(idTask);
    if (id) {
      await reloadTasks(id);
    }
    toast.success("Tarea cerrada parcialmente");
  };

  const handleClickClosePartialClosure = async (
    idTask: TaskWeeklyPlan["id"]
  ) => {
    await closePartialClosure(idTask);
    if (id) {
      await reloadTasks(id);
    }
    toast.success("Tarea reabierta");
  };

  const handleCloseTask = async (idTask: TaskWeeklyPlan["id"]) => {
    await closeTask(idTask);
    if (id) {
      await reloadTasks(id);
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
            if (id) {
              await fetchTasks(id);
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
            if (id) {
              await fetchTasks(id);
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
        <p>
          <span className="font-bold uppercase">ID: </span>
          {task.id}
        </p>
        <p>
          <span className="font-bold uppercase">Semana: </span>
          {task.week}
        </p>
        <p>
          <span className="font-bold uppercase">Tarea: </span>
          {task.task}
        </p>
        <p>
          <span className="font-bold uppercase">Presupuesto: </span>
          <span className="font-bold text-green-500">Q{task.budget}</span>
        </p>
        <p>
          <span className="font-bold uppercase">Fecha de Asignación: </span>
          {task.start_date ?? "Sin asignación"}
        </p>
        <p>
          <span className="font-bold uppercase">Fecha de Cierre: </span>
          {task.end_date ?? "Sin cierre"}
        </p>
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
                    navigate(`/tareas-lote/asignar/${task.id}`, {
                      state: {
                        previousUrl: window.location.pathname,
                      },
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
                    navigate(`/tareas-lote/informacion/${task.id}`, {
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
                  <Eraser className="cursor-pointer text-red-500 hover:text-red-800"  onClick={() => handleEraseTask(task.id)}/>
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
                    navigate(`/tareas-lote/informacion/${task.id}`, {
                      state: {
                        previousUrl: window.location.pathname,
                      },
                    });
                  }}
                />
              </>
            )}

            {(userRole === "admin" || userRole === "adminagricola") && (
              <Edit className="cursor-pointer hover:text-gray-400" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
