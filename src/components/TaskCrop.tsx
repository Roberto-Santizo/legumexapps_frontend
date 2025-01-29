import { TaskCropWeeklyPlan } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import TaskLabel from "./TaskLabel";
import {
  BadgeCheck, CircleAlert,
  FileText,
  Grid2X2Plus,
  ListPlus,
  SquarePlusIcon
} from "lucide-react";
import { useAppStore } from "../stores/useAppStore";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

type TaskCropProps = {
  task: TaskCropWeeklyPlan;
};

export default function TaskCrop({ task }: TaskCropProps) {
  const { weekly_plan_id, lote_plantation_control_id } = useParams();
  const openModal = useAppStore((state) => state.openModal);
  const navigate = useNavigate();
  const closeWeekAssignment = useAppStore((state) => state.closeWeekAssignment);
  const loadingReloadTasks = useAppStore((state) => state.loadingReloadTasks);
  const reloadTasks = useAppStore((state) => state.reloadTasks);

  const handleCloseTask = (task_id: TaskCropWeeklyPlan["id"]) => {
    closeWeekAssignment(task_id).then(() => {
      if (weekly_plan_id && lote_plantation_control_id) {
        reloadTasks(lote_plantation_control_id, weekly_plan_id);
        toast.success("Tarea cerrada semanalmente");
      }
    });
  };

  return (
    <div className="grid grid-cols-6 shadow-xl p-10 text-xl">
      <div className="col-span-5">
        <TaskLabel label={"ID"} text={task.id} />
        <TaskLabel label={"TAREA"} text={task.task} />
        <TaskLabel label={"CULTIVO"} text={task.cultivo} />
      </div>

      {loadingReloadTasks ? (
        <Spinner />
      ) : (
        <div className="col-start-7 space-y-5">
          {task.closed && <BadgeCheck className="text-green-500" />}
          {!task.closed && task.has_assigments && !task.incomplete && (
            <BadgeCheck
              className="cursor-pointer hover:text-gray-400"
              onClick={() => handleCloseTask(task.id)}
            />
          )}

          {!task.assigment_today && !task.closed && (
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
          )}

          {task.has_assigments && task.finished_assigment_today && (
            <FileText
              className="cursor-pointer hover:text-gray-400"
              onClick={() =>
                navigate(
                  `/planes-semanales/tareas-cosecha-lote/resumen/${task.id}`
                )
              }
            />
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

          {task.finished_assigment_today && task.incomplete && !task.closed && (
            <>
              <Grid2X2Plus
                className="cursor-pointer hover:text-red-800 text-red-500"
                onClick={() => openModal(task.id)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
