import { Clock, PlayCircleIcon } from "lucide-react";
import { TaskInProgress as TaskInProgressType } from "../types";
import { Link } from "react-router-dom";

type Props = {
  task: TaskInProgressType;
};

export default function TaskInProgress({ task }: Props) {
  const url = task.total_employees ? `/planes-semanales/tareas-lote/informacion/${task.id}` : `/planes-semanales/tareas-cosecha-lote/informacion/${task.id}`
  return (
    <Link
      key={task.id}
      target="_blank"
      to={url}
      className="flex justify-between p-2 rounded shadow hover:bg-gray-100 hover:scale-105 transition-all"
    >
      <div className="flex gap-2">
        {!task.paused ? (<Clock className="text-orange-500"/>) : (<PlayCircleIcon className="text-green-500"/>)}
        <p>
          Tarea: {task.task} - {task.finca} - {task.lote} - {task.week}
        </p>
      </div>
      <p>
        Empleados Asignados: {' '}
        {task.total_employees ? (<>{task.assigned_employees}/{task.total_employees}</>) : (<>{task.assigned_employees}</>)}
      </p>
    </Link>
  );
}
