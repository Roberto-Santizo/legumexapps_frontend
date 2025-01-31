import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import TaskCrop from "../../../components/TaskCrop";

export default function IndexTareasCosechaLote() {
  const { lote_plantation_control_id, weekly_plan_id } = useParams();
  const [loading,setLoading] = useState<boolean>(false);
  const [error,setError] = useState<boolean>(false);
  const tasksCrops = useAppStore((state) => state.tasksCrops);
  const getTasksCrop = useAppStore((state) => state.getTasksCrop);

  const handleGetTasksCrops = async () => {
    setLoading(true);
    try {
      if (lote_plantation_control_id && weekly_plan_id) {
        await getTasksCrop(lote_plantation_control_id, weekly_plan_id);
      }
    } catch (error) {
      setError(true);
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetTasksCrops();
  }, []);

  return (
    <>
      {(!loading && !error) && <h2 className="font-bold text-3xl">Plan Semanal Semana {tasksCrops.week} - FINCA {tasksCrops.finca} - LOTE {tasksCrops.lote}</h2>}
      {loading && <Spinner />}
      {(!loading && error) && <ShowErrorAPI />}

      <div className="flex flex-col gap-10 mt-10">
        {(!loading && !error && tasksCrops.tasks) && (
          tasksCrops.tasks.map(task => <TaskCrop key={task.id} task={task} />)
        )}
      </div>
    </>
  )
}
