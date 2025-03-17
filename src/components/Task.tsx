import { CircleCheck, CirclePause, Edit, Eraser, Info, PlayCircleIcon, SquarePlusIcon, TrashIcon } from "lucide-react";
import { TasksWeeklyPlan, TaskWeeklyPlan } from "@/types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import TaskLabel from "./TaskLabel";
import DronIcon from "./DronIcon";
import { formatearQuetzales } from "@/helpers";
import { QueryObserverResult, useMutation } from "@tanstack/react-query";
import { cleanTask, closeAssigmentDron, closePartialClosure, closeTask, createPartialClosure, deteleteTask } from "@/api/TasksWeeklyPlanAPI";
import { useState } from "react";
import InsumosModal from "./InsumosModal";

type TaskProps = {
  task: TaskWeeklyPlan;
  role: string;
  getTasks: () => Promise<QueryObserverResult<TasksWeeklyPlan>>
};

export default function Task({ task, role, getTasks }: TaskProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TaskWeeklyPlan['id']>('');
  const { mutate: mutateCloseTask } = useMutation({
    mutationFn: closeTask,
    onError: () => {
      toast.error('Hubo un error al cerrar la tarea');
    },
    onSuccess: () => {
      toast.success('Tarea cerrada correctamente');
      getTasks();
    }
  });

  const { mutate: mutateCleanTask } = useMutation({
    mutationFn: cleanTask,
    onError: () => {
      toast.error('Hubo un error al limpiar la asignación');
    },
    onSuccess: () => {
      toast.success('Asignación borrada correctamente');
      getTasks();
    }
  });

  const { mutate: mutateCreatePartialClosure } = useMutation({
    mutationFn: createPartialClosure,
    onError: () => {
      toast.error('Hubo un error al crear el cierre parcial');
    },
    onSuccess: () => {
      toast.success('Cierre Parcial Creado Correctamente');
      getTasks();
    }
  });

  const { mutate: mutateClosePartialClosure } = useMutation({
    mutationFn: closePartialClosure,
    onError: () => {
      toast.error('Hubo un error al reaperturar la tarea');
    },
    onSuccess: () => {
      toast.success('Tarea reaperturada correctamente');
      getTasks();
    }
  });

  const { mutate: mutateCloseAssigmentDron } = useMutation({
    mutationFn: closeAssigmentDron,
    onError: () => {
      toast.error('Hubo un error al cerrar la asignación');
    },
    onSuccess: () => {
      toast.success('Asignación creada correctamente');
      getTasks();
    }
  });

  const { mutate: mutateDeleteTask } = useMutation({
    mutationFn: deteleteTask,
    onError: () => {
      toast.error('Hubo un error al eliminar la tarea');
    },
    onSuccess: () => {
      toast.success('Tarea eliminada correctamente');
      getTasks();
    }
  });

  const handleCloseTask = async (idTask: TaskWeeklyPlan["id"]) => {
    if (task.insumos.length > 0) {
      setIsOpen(true);
      setSelectedTask(idTask);
    } else {
      Swal.fire({
        title: "¿Desea cerrar la tarea?",
        text: `La tarea no se podrá a reaperturar`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Cerrar Asignación",
      }).then(async (result) => {
        if (result.isConfirmed) {
          mutateCloseTask(idTask);
        }
      })
    }
  };

  const handleEraseTask = async (idTask: TaskWeeklyPlan["id"]) => {
    Swal.fire({
      title: "¿Desea limpiar la asignación de esta tarea?",
      text: `La asignación no se podrá recuperar`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Limpiar Tarea",
    }).then(async (result) => {
      if (result.isConfirmed) {
        mutateCleanTask(idTask)
      }
    })
  }

  const handleCreatePartialClosure = async (idTask: TaskWeeklyPlan["id"]) => {
    Swal.fire({
      title: "¿Desea crear un cierre parcial a tarea?",
      text: `Una vez creado debe tomar en cocideración las reglas de los cierres parciales`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Crear Cierre Parcial",
    }).then(async (result) => {
      if (result.isConfirmed) {
        mutateCreatePartialClosure(idTask)
      }
    })
  };

  const handleClickClosePartialClosure = async (idTask: TaskWeeklyPlan["id"]) => {
    Swal.fire({
      title: "¿Desea reaperturar la tarea?",
      text: `Una vez reaperturada no se podrá modificar la fecha de reapertura`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Reaperturar Tarea",
    }).then(async (result) => {
      if (result.isConfirmed) {
        mutateClosePartialClosure(idTask)
      }
    })
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
        mutateCloseAssigmentDron(id)
      }
    })
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
        mutateDeleteTask(idTask)
      }
    });
  };

  return (
    <div className="grid grid-cols-6 shadow-xl p-10 text-xl">
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
        <div className="flex gap-3">
          {task.use_dron && <DronIcon width={30} height={30} className="bg-orange-500 text-white inline-block p-2 rounded mt-4" />}
          {task.weekly_plan_change && <p className="bg-red-500 text-white inline-block p-2 rounded mt-4 font-bold">ATRASADA</p>}
          {task.extraordinary && <p className="bg-blue-500 text-white inline-block p-2 rounded mt-4 font-bold">EXTRAORDINARIA</p>}
        </div>
      </div>

      <div className="col-start-7 space-y-5">
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
                onClick={() => handleCreatePartialClosure(task.id)}
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
      </div>

      {isOpen && (
        <InsumosModal isOpen={isOpen} getTasks={getTasks} setIsOpen={setIsOpen} idTask={selectedTask} />
      )}
    </div>
  );
}
