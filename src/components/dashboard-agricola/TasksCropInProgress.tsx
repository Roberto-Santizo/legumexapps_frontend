import Spinner from "../utilities-components/Spinner";
import { getTasksCropInProgress } from "@/api/DashboardAgricolaAPI";
import { useQuery } from "@tanstack/react-query";
import ShowErrorAPI from "../utilities-components/ShowErrorAPI";
import TaskCropInProgressComponent from "./TaskCropInProgressComponent";

export default function TasksCropInProgress() {

  const { data: tasksInProgress, isLoading, isError } = useQuery({
    queryKey: ['getTasksCropInProgress'],
    queryFn: getTasksCropInProgress
  });

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  if (tasksInProgress) return (
    <div className="flex flex-col items-center shadow-xl row-start-5 col-start-1 col-span-12 rounded-xl gap-5">
      <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
        Control de Cosechas en Proceso
      </p>
      {(tasksInProgress.length === 0) && (<p className="text-center mt-1">No hay datos</p>)}
      <div className="w-full p-2  max-h-96 overflow-y-auto">
        <div className="font-bold space-y-5">
          {tasksInProgress.map((task) => (
            <TaskCropInProgressComponent key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
