import { useAppStore } from "../../stores/useAppStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TaskInProgress as TaskInProgressType } from "../../types";
import Spinner from "../Spinner";
import TaskInProgress from "../TaskInProgress";

export default function TasksInProgress() {
  const [loading, setLoading] = useState<boolean>(false);
  const [tasksInProgress, setTasksInProgress] = useState<TaskInProgressType[]>([]);
  const getTasksInProgress = useAppStore((state) => state.getTasksInProgress);

  const handleGetInfo = async () => {
    setLoading(true);
    try {
      const tasks = await getTasksInProgress();
      setTasksInProgress(tasks);
    } catch (error) {
      toast.error("Hubo un error al traer la información");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetInfo();
  }, []);
  return (
    <div className="flex flex-col items-center shadow-xl row-start-3 col-start-1 col-span-12 rounded-xl gap-2">
      <p className="uppercase w-full text-center bg-gray-400 p-2 text-white font-bold rounded-t-xl text-2xl">
        Control de Tareas en Proceso y Asignaciones
      </p>

      {(!loading && tasksInProgress.length === 0) && (<p className="text-center mt-2">No hay datos</p>)}
      <div className="w-full p-5 font-bold space-y-5">
        {loading && <Spinner />}
        {!loading && (
          <>
            {tasksInProgress.map((task) => (
              <TaskInProgress key={task.id} task={task} handleGetInfo={handleGetInfo}/>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
