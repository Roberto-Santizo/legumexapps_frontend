import { TaskCropWeeklyPlan } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import TaskLabel from "./TaskLabel";
import {
  BadgeCheck,
  FileText,
  Grid2X2Plus,
  ListPlus,
  SquarePlusIcon,
} from "lucide-react";
import { useAppStore } from "../stores/useAppStore";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import { useState } from "react";

type TaskCropProps = {
  task: TaskCropWeeklyPlan;
};

export default function TaskCrop({ task }: TaskCropProps) {
  const { weekly_plan_id, lote_plantation_control_id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const loadingReloadTasks = useAppStore((state) => state.loadingReloadTasks);

  const openModal = useAppStore((state) => state.openModal);
  const navigate = useNavigate();
  const closeWeekAssignment = useAppStore((state) => state.closeWeekAssignment);
  const getTasksCrop = useAppStore((state) => state.getTasksCrop);

  const handleCloseTask = async (task_id: TaskCropWeeklyPlan["id"]) => {
    setLoading(true);
    try {
      await closeWeekAssignment(task_id);
      if (weekly_plan_id && lote_plantation_control_id) {
        await getTasksCrop(lote_plantation_control_id, weekly_plan_id);
        toast.success("Tarea cerrada semanalmente");
      }
    } catch (error) {
      toast.error(
        "Hubo un error al cerrar la tarea, intentelo de nuevo más tarde"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-6 shadow-xl p-10 text-xl">
      <div className="col-span-5">
        <TaskLabel label={"ID"} text={task.id} />
        <TaskLabel label={"TAREA"} text={task.task} />
        <TaskLabel label={"CULTIVO"} text={task.cultivo} />
      </div>

      {loading || loadingReloadTasks ? (
        <Spinner />
      ) : (
        <div className="col-start-7 space-y-5">
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

          {task.has_assigments && task.incomplete && !task.closed && (
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
