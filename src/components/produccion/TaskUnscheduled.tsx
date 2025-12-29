import { Calendar, Divide, EditIcon, TrashIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TaskProductionNoOperationDate } from "@/types/taskProductionPlanTypes";
import { assignOperationDate, deleteTaskProduction } from "@/api/TaskProductionPlansAPI";
import { useAppStore } from "@/store";
import { usePermissions } from "@/hooks/usePermissions";
import { useNotification } from "../../core/notifications/NotificationContext";

type Props = {
  task: TaskProductionNoOperationDate;
}

export default function TaskUnscheduled({ task }: Props) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date')!;
  const params = useParams();
  const plan_id = params.plan_id!;
  const queryClient = useQueryClient();
  const notify = useNotification();

  const { hasPermission } = usePermissions();

  const filtersNoOperationDate = useAppStore((state) => state.filtersNoOperationDate);
  const filtersWithOperationDate = useAppStore((state) => state.filtersWithOperationDate);

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: assignOperationDate,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      queryClient.invalidateQueries({ queryKey: ['getWeeklyProductionPlanEvents', plan_id] });
      queryClient.invalidateQueries({ queryKey: ['getTasksNoOperationDate', plan_id, filtersNoOperationDate] });
      queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', plan_id, date, filtersWithOperationDate] });
      queryClient.invalidateQueries({ queryKey: ['getLineHoursPerWeek', plan_id] });

    }
  });


  const { mutate: deleteTask } = useMutation({
    mutationFn: deleteTaskProduction,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data);
      queryClient.invalidateQueries({ queryKey: ['getTasksNoOperationDate', plan_id, filtersNoOperationDate] });
      queryClient.invalidateQueries({ queryKey: ['getLineHoursPerWeek', plan_id] });
    }
  });

  const handleEditClick = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("editTask", task.id);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const handleDivideTask = (id: TaskProductionNoOperationDate['id']) => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set("reprogramTask", id);
    navigate(`${location.pathname}?${currentParams.toString()}`);
  }

  return (
    <div className="border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">
      <div className="p-6 space-y-2 text-gray-700 xl:text-base text-xs leading-relaxed">
        <p><span className="font-semibold text-gray-900">SKU:</span> {task.sku}</p>
        <p><span className="font-semibold text-gray-900">Producto:</span> {task.product_name}</p>
        <p><span className="font-semibold text-gray-900">Línea:</span> {task.line}</p>
        <p><span className="font-semibold text-gray-900">Total libras:</span> {task.total_lbs}</p>
        <p><span className="font-semibold text-gray-900">Destino:</span> {task.destination}</p>
      </div>

      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 flex-col">
        <button
          disabled={!date || isPending}
          onClick={() => mutate({ id: task.id, date: date })}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-xs xl:text-base font-medium transition-all 
            ${date ? 'bg-white hover:border-gray-400 hover:shadow-md text-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Asignar a fecha:</span>
          <span className="font-semibold">{date || 'Ninguna'}</span>
        </button>

        <button
          onClick={() => handleDivideTask(task.id)}
          className={'inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-xs xl:text-base font-medium transition-all hover:bg-gray-200'}
        >
          <Divide className="w-4 h-4" />
          <p>Dividr tarea</p>
        </button>

        {hasPermission('edit production task') && (
          <button
            onClick={() => handleEditClick()}
            className="action-btn"
          >
            <EditIcon className="w-4 h-4" />
            <span className="hidden xl:inline">Editar Tarea</span>
          </button>
        )}

        {hasPermission('delete production task') && (
          <button
            onClick={() => deleteTask({ taskId: task.id })}
            className="action-btn hover:bg-red-200"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="hidden xl:inline">Eliminar Tarea</span>
          </button>
        )}
      </div>
    </div>
  );
}
