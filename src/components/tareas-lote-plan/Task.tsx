import { CircleCheck, CirclePause, Edit, Eraser, Info, PlayCircleIcon, TrashIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { formatearQuetzales } from "@/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cleanTask, closeAssigment, closeAssigmentDron, closePartialClosure, closeTask, createPartialClosure, deteleteTask } from "@/api/TasksWeeklyPlanAPI";
import { usePermissions } from "@/hooks/usePermissions";
import { FiltersTareasLoteType } from "@/views/agricola/lote-tasks/Index";
import Swal from "sweetalert2";
import TaskLabel from "../utilities-components/TaskLabel";
import DronIcon from "../dashboard-agricola/DronIcon";
import { TaskWeeklyPlan } from "types/taskWeeklyPlanTypes";
import Spinner from "../utilities-components/Spinner";

type TaskProps = {
  task: TaskWeeklyPlan;
  filters: FiltersTareasLoteType;
  isAdmin: boolean;
};

export default function Task({ task, filters, isAdmin }: TaskProps) {
  const params = useParams();
  const lote_plantation_control_id = params.lote_plantation_control_id!;
  const weekly_plan_id = params.weekly_plan_id!;
  const queryClient = useQueryClient();
  const { hasPermission } = usePermissions();

  const navigate = useNavigate();
  const notify = useNotification();

  const { mutate: mutateCloseTask } = useMutation({
    mutationFn: closeTask,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      queryClient.invalidateQueries({ queryKey: ['getTasks', lote_plantation_control_id, weekly_plan_id, filters], })
    }
  });

  const { mutate: mutateCleanTask } = useMutation({
    mutationFn: cleanTask,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      queryClient.invalidateQueries({ queryKey: ['getTasks', lote_plantation_control_id, weekly_plan_id, filters], })
    }
  });

  const { mutate: startTask, isPending } = useMutation({
    mutationFn: closeAssigment,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      queryClient.invalidateQueries({ queryKey: ['getTasks', lote_plantation_control_id, weekly_plan_id, filters], })
    },
  });

  const { mutate: startTask, isPending } = useMutation({
    mutationFn: closeAssigment,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['getTasks', lote_plantation_control_id, weekly_plan_id, filters], })
    },
  });

  const { mutate: mutateCreatePartialClosure } = useMutation({
    mutationFn: createPartialClosure,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      queryClient.invalidateQueries({ queryKey: ['getTasks', lote_plantation_control_id, weekly_plan_id, filters], })
    }
  });

  const { mutate: mutateClosePartialClosure } = useMutation({
    mutationFn: closePartialClosure,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      queryClient.invalidateQueries({ queryKey: ['getTasks', lote_plantation_control_id, weekly_plan_id, filters], })
    }
  });

  const { mutate: mutateCloseAssigmentDron } = useMutation({
    mutationFn: closeAssigmentDron,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      queryClient.invalidateQueries({ queryKey: ['getTasks', lote_plantation_control_id, weekly_plan_id, filters], })
    }
  });

  const { mutate: mutateDeleteTask } = useMutation({
    mutationFn: deteleteTask,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      queryClient.invalidateQueries({ queryKey: ['getTasks', lote_plantation_control_id, weekly_plan_id, filters], })
    }
  });

  const handleCloseTask = async (idTask: TaskWeeklyPlan["id"]) => {
    if (task.insumos.length > 0) {
      navigate(`${location.pathname}?closeTaskId=${task.id}`);
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
    <div className="flex flex-col xl:grid xl:grid-cols-6 shadow-xl p-10 text-xs xl:text-xl">
      <div className="col-span-5">
        <TaskLabel label={"ID"} text={task.id} />
        <TaskLabel label={"Lote"} text={task.lote} />
        <TaskLabel label={"Cdp"} text={task.cdp} />
        <TaskLabel label={"Semana"} text={task.week.toString()} />
        <TaskLabel label={"Horas Teoricas"} text={`${task.hours.toString()} horas`} />
        <TaskLabel label={"Tarea"} text={task.task} />

        {hasPermission('see budget') && (
          <TaskLabel
            label={"Presupuesto"}
            text={formatearQuetzales(task.budget)}
            text_classes="text-green-500 font-bold"
          />
        )}

        <TaskLabel
          label={"Fecha de Asignación"}
          text={task.start_date ?? "Sin asignación"}
        />
        <TaskLabel
          label={"Fecha de Cierre"}
          text={task.end_date ?? "Sin cierre"}
        />
        <div className="flex gap-3">
          {task.use_dron && <DronIcon width={30} height={30} className="bg-orange-500 text-white inline-block p-2 rounded mt-4" />}
          {task.weekly_plan_change && <p className="bg-red-500 text-white inline-block p-2 rounded mt-4 font-bold">ATRASADA</p>}
          {task.extraordinary && <p className="bg-blue-500 text-white inline-block p-2 rounded mt-4 font-bold">EXTRAORDINARIA</p>}
        </div>
      </div>

      <div className="col-start-7 space-y-5">
        <div className="flex xl:flex-col justify-center items-center gap-4 mt-5 xl:mt-0">
          {!task.start_date && !task.end_date && !task.active_closure && (
            <>
              <button disabled={isPending} onClick={() => startTask(task.id)}>
                {isPending ? <Spinner /> : <PlayCircleIcon />}
              </button>
              <DronIcon
                onClick={() => handleCloseTaskDron(task.id)}
                className="cursor-pointer hover:text-gray-500"
                width={35}
                height={35}
              />
              {isAdmin && (
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

              {isAdmin && (
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

          {isAdmin && (
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
    </div>
  );
}
