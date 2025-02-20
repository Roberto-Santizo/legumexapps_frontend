import { TaskCropInProgress } from "../types";
import { Link } from "react-router-dom";
import { Clock, Eye } from "lucide-react";

type TaskCropProps = {
  task: TaskCropInProgress;
};

export default function TaskCropInProgressComponent({ task }: TaskCropProps) {
  const url = `/planes-semanales/tareas-cosecha-lote/informacion/${task.id}`;

  return (
    <div
    key={task.id}
    className="flex justify-between p-2 rounded shadow cursor pointer"
  >
    <div className="flex gap-2">
    <Clock className="text-orange-500" />
      <p>
        Tarea: {task.task} - {task.finca} - {task.lote} - S{task.week}
      </p>
    </div>
    <div className="flex flex-row gap-5">
      <Link target="_blank" to={url}>
        <Eye className="hover:text-gray-500" />
      </Link>
    </div>
  </div>
  );
}
