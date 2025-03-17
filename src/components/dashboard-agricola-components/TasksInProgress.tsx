import Spinner from "../Spinner";
import TaskInProgress from "../TaskInProgress";
import { getTasksInProgress } from "@/api/DashboardAgricolaAPI";
import { useQuery } from "@tanstack/react-query";
import ShowErrorAPI from "../ShowErrorAPI";

export default function TasksInProgress() {
  const { data: tasksInProgress, isError, isLoading, refetch } = useQuery({
    queryKey: ['getTasksInProgress'],
    queryFn: getTasksInProgress
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (tasksInProgress) return (
    <div className="flex flex-col items-center shadow-xl row-start-3 col-start-1 col-span-12 rounded-xl gap-2">
      <p className="uppercase w-full text-center bg-gray-400 p-2 text-white font-bold rounded-t-xl text-2xl">
        Control de Tareas en Proceso y Asignaciones
      </p>

      {(tasksInProgress.length === 0) && (<p className="text-center mt-2">No hay datos</p>)}
      <div className="w-full h-max-96 overflow-y-auto p-5 font-bold space-y-5">
        {tasksInProgress.map((task) => (
          <TaskInProgress key={task.id} task={task} refetch={refetch} />
        ))}
      </div>
    </div>
  );
}
