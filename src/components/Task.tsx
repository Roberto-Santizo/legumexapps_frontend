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
import TaskLabel from "./TaskLabel";
import { useState } from "react";
import ShowErrorAPI from "./ShowErrorAPI";
import DronIcon from "./DronIcon";
import { formatearQuetzales } from "../helpers";

type TaskProps = {
  task: TaskWeeklyPlan;
  role: string;
};

export default function Task({ task, role }: TaskProps) {
  const { lote_plantation_control_id, weekly_plan_id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const createPartialClosure = useAppStore(
    (state) => state.createPartialClosure
  );
  const closePartialClosure = useAppStore((state) => state.closePartialClosure);
  const closeTaskDron = useAppStore((state) => state.closeAssigmentDron);
  const closeTask = useAppStore((state) => state.closeTask);
  const cleanTask = useAppStore((state) => state.cleanTask);
  const getTasks = useAppStore((state) => state.getTasks);
  const deteleteTask = useAppStore((state) => state.deteleteTask);
  const openModalAction = useAppStore((state) => state.openModalAction);

  const navigate = useNavigate();

  const handleClickCreatePartialClosure = async (
    idTask: TaskWeeklyPlan["id"]
  ) => {
    setLoading(true);
    try {
      await createPartialClosure(idTask);
      if (lote_plantation_control_id && weekly_plan_id) {
        await getTasks(lote_plantation_control_id, weekly_plan_id);
      }
      toast.success("Tarea cerrada parcialmente");
    } catch (error) {
      toast.error("Hubo un error al cerrar parcialmente");
    } finally {
      setLoading(false);
    }
  };

  const handleClickClosePartialClosure = async (
    idTask: TaskWeeklyPlan["id"]
  ) => {
    setLoading(true);
    try {
      await closePartialClosure(idTask);
      if (lote_plantation_control_id && weekly_plan_id) {
        await getTasks(lote_plantation_control_id, weekly_plan_id);
      }
      toast.success("Tarea reabierta");
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTask = async (idTask: TaskWeeklyPlan["id"]) => {
    if (task.insumos.length > 0) {
      openModalAction(idTask);
    } else {
      setLoading(true);
      try {
        await closeTask(idTask);
        toast.success("Tarea Cerrada Correctamente");
        if (lote_plantation_control_id && weekly_plan_id) {
          await getTasks(lote_plantation_control_id, weekly_plan_id);
        }
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
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
        setLoading(true);
        try {
          deteleteTask(idTask);
          toast.success("Tarea Eliminada correctamente");
          (async () => {
            if (task.lote_plantation_control_id && weekly_plan_id) {
              await getTasks(task.lote_plantation_control_id, weekly_plan_id);
            }
          })();
        } catch (error) {
          toast.error("Hubo un error al cerrar la asignación");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleCloseTaskDron = async (id: TaskWeeklyPlan["id"]) => {
    Swal.fire({
      title: "¿Desea asignar la tarea a horas dron?",
      text: `La asignación no contará con empleados y se realizará con dron`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Cerrar Asignación",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (task.insumos.length > 0) {
            openModalAction(task.id);
          }else{
            await closeTaskDron(id);

            if (lote_plantation_control_id && weekly_plan_id) {
              await getTasks(lote_plantation_control_id, weekly_plan_id);
            }
          }

          toast.success("Asignación creada Correctamente");
        } catch (error) {
          toast.error("Hubo un error al cerrar la asignación");
        }
      }
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleEraseTask = async (idTask: TaskWeeklyPlan["id"]) => {
    setLoading(true);

    Swal.fire({
      title: "¿Desea limpiar la asignación de esta tarea?",
      text: `La asignación no se podrá recuperar`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Limpiar Tarea",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await cleanTask(idTask);

            if (lote_plantation_control_id && weekly_plan_id) {
              await getTasks(lote_plantation_control_id, weekly_plan_id);
            }

            toast.success("Asignación Eliminada Correctamente");
          } catch (error) {
            toast.error("Hubo un error al cerrar la asignación");
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="grid grid-cols-6 shadow-xl p-10 text-xl">
      {error && <ShowErrorAPI />}
      <div className="col-span-5">
        <TaskLabel label={"ID"} text={task.id} />
        <TaskLabel label={"Lote"} text={task.lote} />
        <TaskLabel label={"Semana"} text={task.week.toString()} />
        <TaskLabel label={"Horas Teoricas"} text={`${task.hours.toString()} horas`} />
        <TaskLabel label={"Tarea"} text={task.task} />
        <TaskLabel
          label={"Presupuesto"}
          text={formatearQuetzales(task.budget)}
          text_classes="text-green-500 font-bold"
        />
        <TaskLabel
          label={"Fecha de Asignación"}
          text={
            task.start_date ? task.start_date : "Sin asignación"
          }
        />
        <TaskLabel
          label={"Fecha de Cierre"}
          text={task.end_date ? task.end_date : "Sin cierre"}
        />
        {task.use_dron && <DronIcon width={30} height={30} className="bg-orange-500 text-white inline-block p-2 rounded mt-4"/>}
        {task.weekly_plan_change && <p className="bg-red-500 text-white inline-block p-2 rounded mt-4 font-bold">ATRASADA</p>}
        {task.extraordinary && <p className="bg-blue-500 text-white inline-block p-2 rounded mt-4 font-bold">EXTRAORDINARIA</p>}
      </div>

      <div className="col-start-7 space-y-5">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col justify-center items-center gap-4">
            {!task.start_date && !task.end_date && !task.active_closure && (
              <>
                <SquarePlusIcon
                  className="cursor-pointer hover:text-gray-400"
                  onClick={() =>
                    navigate(
                      `/planes-semanales/tareas-lote/asignar/${task.finca_id}/${task.id}`,
                      {
                        state: {
                          previousUrl: window.location.pathname,
                        },
                      }
                    )
                  }
                />
                <DronIcon
                  onClick={() => handleCloseTaskDron(task.id)}
                  className="cursor-pointer hover:text-gray-500"
                  width={35}
                  height={35}
                />
                {(role === "admin" || role === "adminagricola") && (
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
                    navigate(
                      `/planes-semanales/tareas-lote/informacion/${task.id}`,
                      {
                        state: {
                          previousUrl: window.location.pathname,
                        },
                      }
                    );
                  }}
                />
                <CirclePause
                  className="cursor-pointer text-orange-500 hover:text-orange-800"
                  onClick={() => handleClickCreatePartialClosure(task.id)}
                />

                {(role === "admin" || role === "adminagricola") && (
                  <Eraser
                    className="cursor-pointer text-red-500 hover:text-red-800"
                    onClick={() => handleEraseTask(task.id)}
                  />
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
                    navigate(
                      `/planes-semanales/tareas-lote/informacion/${task.id}`
                    );
                  }}
                />
              </>
            )}

            {(role === "admin" || role === "adminagricola") && (
              <Edit
                className="cursor-pointer hover:text-gray-400"
                onClick={() => {
                  navigate(`/planes-semanales/tareas-lote/editar/${task.id}`, {
                    state: {
                      previousUrl: window.location.pathname,
                    },
                  });
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
