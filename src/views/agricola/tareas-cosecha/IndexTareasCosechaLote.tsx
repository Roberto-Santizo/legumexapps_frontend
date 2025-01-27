import { useEffect } from "react";
import { useAppStore } from "../../../stores/useAppStore"
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import TaskCrop from "../../../components/TaskCrop";

export default function IndexTareasCosechaLote() {
  const { lote_plantation_control_id, weekly_plan_id } = useParams();
  const getTasksCrop = useAppStore((state) => state.getTasksCrop);
  const loadingGetTasks = useAppStore((state) => state.loadingGetTasks);
  const errorGetTasks = useAppStore((state) => state.errorGetTasks);
  const tasksCrops = useAppStore((state) => state.tasksCrops);

  useEffect(() => {
    if (lote_plantation_control_id && weekly_plan_id) {
      getTasksCrop(lote_plantation_control_id, weekly_plan_id)
    }
  }, []);

  console.log(tasksCrops);
  return (
    <>
      {(!loadingGetTasks && !errorGetTasks) && <h2 className="font-bold text-3xl">Plan Semanal Semana {tasksCrops.week} - FINCA {tasksCrops.finca} - LOTE {tasksCrops?.lote}</h2>}
      {loadingGetTasks && <Spinner />}
      {(!loadingGetTasks && errorGetTasks) && <ShowErrorAPI />}

      <div className="flex flex-col gap-10 mt-10">
        {(!loadingGetTasks && !errorGetTasks && tasksCrops.tasks) && (
          tasksCrops.tasks.map(task => <TaskCrop task={task} />)
        )}
      </div>
    </>
  )
}
