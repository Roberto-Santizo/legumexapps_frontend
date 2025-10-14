import { TaskCropWeeklyPlan, TasksCropWeeklyPlan } from "../../types";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, FileText, Grid2X2Plus, ListPlus, SquarePlusIcon } from "lucide-react";
import { QueryObserverResult, useMutation } from "@tanstack/react-query";
import { closeWeekAssignment } from "@/api/TaskCropWeeklyPlanAPI";
import { Dispatch } from "react";
import { useRole } from "@/hooks/useRole";
import TaskLabel from "../utilities-components/TaskLabel";
import Spinner from "../utilities-components/Spinner";
import ShowErrorAPI from "../utilities-components/ShowErrorAPI";
import { useNotification } from "../../core/notifications/NotificationContext";

type TaskCropProps = {
  task: TaskCropWeeklyPlan;
  refetch: () => Promise<QueryObserverResult<TasksCropWeeklyPlan>>;
  setId: Dispatch<React.SetStateAction<string>>;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

export default function TaskCrop({ task, refetch, setId, setIsOpen }: TaskCropProps) {
  const navigate = useNavigate();
  const notify = useNotification();

  const { data: role, isLoading, isError } = useRole();

  const { mutate, isPending } = useMutation({
    mutationFn: closeWeekAssignment,
    onError: () => {
      notify.error('Hubo un error al cerrar la tarea');
    },
    onSuccess: () => {
      refetch();
      notify.success("Tarea cerrada semanalmente");
    }
  });

  const handleCloseTask = async (task_id: TaskCropWeeklyPlan["id"]) => mutate(task_id);

  if (isPending) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (role) return (
    <div className="grid grid-cols-6 shadow-xl p-10 text-xl">
      <div className="col-span-5">
        <TaskLabel label={"ID"} text={task.id} />
        <TaskLabel label={"TAREA"} text={task.task} />
        <TaskLabel label={"CULTIVO"} text={task.cultivo} />
      </div>

      <div className="col-start-7 space-y-5">
        {isLoading && <Spinner />}
        {task.closed && (
          <>
            <BadgeCheck className="text-green-500" />
            <FileText
              className="cursor-pointer hover:text-gray-400"
              onClick={() =>
                navigate(
                  `/planes-semanales/tareas-cosecha-lote/resumen/${task.id}`
                )
              }
            />
          </>
        )}
        {!task.closed && task.has_assigments && !task.incomplete && !task.assigment_today && (
          <>
            <FileText
              className="cursor-pointer hover:text-gray-400"
              onClick={() =>
                navigate(
                  `/planes-semanales/tareas-cosecha-lote/resumen/${task.id}`
                )
              }
            />
          </>
        )}

        {!task.assigment_today && !task.closed && (
          <>
            <BadgeCheck
              className="cursor-pointer hover:text-gray-400"
              onClick={() => handleCloseTask(task.id)}
            />
            <SquarePlusIcon
              className="cursor-pointer hover:text-gray-400"
              onClick={() =>
                navigate(
                  `/planes-semanales/tareas-cosecha-lote/asignar/${task.id}/${task.finca_id}`,
                  {
                    state: {
                      previousUrl: window.location.pathname,
                    },
                  }
                )
              }
            />
          </>
        )}

        {task.assigment_today &&
          !task.finished_assigment_today &&
          !task.closed && (
            <ListPlus
              className="cursor-pointer hover:text-gray-400"
              onClick={() =>
                navigate(
                  `/planes-semanales/tareas-cosecha-lote/toma-rendimiento/${task.id}`,
                  {
                    state: {
                      previousUrl: window.location.pathname,
                    },
                  }
                )
              }
            />
          )}

        {(role === 'admin' || role === 'adminagricola') && (
          <Grid2X2Plus
            className="cursor-pointer hover:text-red-800 text-red-500"
            onClick={() => {
              setIsOpen(true);
              setId(task.id)
            }}
          />
        )}

      </div>
    </div>
  );
}
