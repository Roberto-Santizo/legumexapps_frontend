import { CircleCheck, Clock, Eye, PlayCircleIcon } from "lucide-react";
import { TaskInProgress as TaskInProgressType, TaskWeeklyPlan } from "../types";
import { Link } from "react-router-dom";
import { useAppStore } from "../stores/useAppStore";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

type Props = {
  task: TaskInProgressType;
  handleGetInfo: () => Promise<void>
};

export default function TaskInProgress({ task, handleGetInfo }: Props) {
  const url = task.total_employees ? `/planes-semanales/tareas-lote/informacion/${task.id}` : `/planes-semanales/tareas-cosecha-lote/informacion/${task.id}`
  const openModalAction = useAppStore((state) => state.openModalAction);
  const closeTask = useAppStore((state) => state.closeTask)

  const handleCloseTask = async (idTask: TaskWeeklyPlan["id"]) => {
    if (task.has_insumos) {
      openModalAction(idTask);
    } else {
      Swal.fire({
        title: "¿Deseas cerrar esta tarea?",
        showCancelButton: true,
        cancelButtonText: 'CANCELAR',
        confirmButtonText: "CERRAR TAREA",
        confirmButtonColor: 'red'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await closeTask(idTask);
            await handleGetInfo();
            toast.success("Tarea Cerrada Correctamente");
          } catch (error) {
            toast.error('Hubo un error al traer la información');
          }
        }
      });
    }
  };

  return (
    <div
      key={task.id}
      className="flex justify-between p-2 rounded shadow cursor pointer"
    >
      <div className="flex gap-2">
        {!task.paused ? (<Clock className="text-orange-500" />) : (<PlayCircleIcon className="text-green-500" />)}
        <p>
          Tarea: {task.task} - {task.finca} - {task.lote} - {task.week}
        </p>
      </div>
      <p>
        Empleados Asignados: {' '}
        {task.total_employees ? (<>{task.assigned_employees}/{task.total_employees}</>) : (<>{task.assigned_employees}</>)}
      </p>
      <div className="flex flex-row gap-5">
        <CircleCheck className="hover:text-gray-500 cursor-pointer" onClick={() => handleCloseTask(task.id)} />
        <Link target="_blank" to={url}>
          <Eye className="hover:text-gray-500" />
        </Link>
      </div>
    </div>
  );
}
