import {
  CircleCheck,
  CirclePause,
  Edit,
  Eraser,
  Info,
  PlayCircleIcon,
  SquarePlusIcon,
  TrashIcon,
} from "lucide-react";
import { useAppStore } from "../stores/useAppStore";
import { TaskWeeklyPlan } from "../types";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

type TaskProps = {
  task: TaskWeeklyPlan;
  id: string | undefined;
};

export default function Task({ task, id }: TaskProps) {
  const createPartialClosure = useAppStore(
    (state) => state.createPartialClosure
  );
  const reloadTasks = useAppStore((state) => state.reloadTasks);
  const loadingUpdateTask = useAppStore((state) => state.loadingUpdateTask);
  const handleClick = async (idTask: TaskWeeklyPlan["id"]) => {
    await createPartialClosure(idTask);
    if (id) {
      await reloadTasks(id);
    }
    toast.success("Tarea cerrada parcialmente");
  };
  return (
    <div className="grid grid-cols-6 shadow-xl p-10 text-xl">
      <div className="col-span-5">
        <p>
          <span className="font-bold uppercase">ID: </span>
          {task.id}
        </p>
        <p>
          <span className="font-bold uppercase">Semana: </span>
          {task.week}
        </p>
        <p>
          <span className="font-bold uppercase">Tarea: </span>
          {task.task}
        </p>
        <p>
          <span className="font-bold uppercase">Presupuesto: </span>
          <span className="font-bold text-green-500">Q{task.budget}</span>
        </p>
        <p>
          <span className="font-bold uppercase">Fecha de Asignación: </span>
          {task.start_date ?? "Sin asignación"}
        </p>
        <p>
          <span className="font-bold uppercase">Fecha de Cierre: </span>
          {task.end_date ?? "Sin cierre"}
        </p>
      </div>

      <div className="col-start-7 space-y-5">
        {loadingUpdateTask ? (
          <Spinner />
        ) : (
          <>
            {!task.start_date && !task.end_date && !task.active_closure && (
              <>
                <SquarePlusIcon className="cursor-pointer hover:text-gray-400" />
                <TrashIcon className="cursor-pointer hover:text-red-400" />
              </>
            )}

            {task.start_date && !task.end_date && !task.active_closure && (
              <>
                <CircleCheck className="cursor-pointer hover:text-green-400" />
                <Info className="cursor-pointer hover:text-gray-400" />
                <CirclePause
                  className="cursor-pointer text-orange-500 hover:text-orange-800"
                  onClick={() => handleClick(task.id)}
                />
                <Eraser className="cursor-pointer text-red-500 hover:text-red-800" />
              </>
            )}
            {task.active_closure && (
              <PlayCircleIcon className="cursor-pointer text-green-500 hover:text-green-400" />
            )}

            {task.start_date && task.end_date && !task.active_closure && (
              <>
                <CircleCheck className="cursor-pointer text-green-500 hover:text-green-400" />
                <Info className="cursor-pointer hover:text-gray-400" />
              </>
            )}

            <Edit className="cursor-pointer hover:text-gray-400" />
          </>
        )}
      </div>
    </div>
  );
}
