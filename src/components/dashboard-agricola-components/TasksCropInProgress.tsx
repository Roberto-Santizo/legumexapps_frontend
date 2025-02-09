import { useAppStore } from "../../stores/useAppStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TaskInProgress as TaskInProgressType } from "../../types";
import TaskInProgressComponent from "../TaskInProgress";
import Spinner from "../Spinner";

type Props = {
  permission: string
}

export default function TasksCropInProgress({permission} : Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [tasksInProgress, setTasksInProgress] = useState<TaskInProgressType[]>(
    []
  );
  const getTasksCropInProgress = useAppStore(
    (state) => state.getTasksCropInProgress
  );

  const handleGetInfo = async () => {
    setLoading(true);
    try {
      const tasks = await getTasksCropInProgress(permission);
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
    <div className="flex flex-col items-center shadow-xl row-start-5 col-start-1 col-span-12 rounded-xl gap-5">
      {/* contenedor de resumen de horas */}
      <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
        Control de Cosechas en Proceso
      </p>
      {(!loading && tasksInProgress.length === 0) && (<p className="text-center mt-1">No hay datos</p>)}
      <div className="w-full p-2">
        <div className="font-bold space-y-5">
          {loading ? (
            <Spinner />
          ) : (
            <>
              {tasksInProgress.map((task) => (
                <TaskInProgressComponent key={task.id} task={task} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
