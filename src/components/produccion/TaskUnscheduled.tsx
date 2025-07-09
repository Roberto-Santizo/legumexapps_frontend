import { Calendar, Divide } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TaskProductionNoOperationDate } from "types/taskProductionPlanTypes";
import { assignOperationDate } from "@/api/TaskProductionPlansAPI";
import { toast } from "react-toastify";
import { useAppStore } from "@/store";

type Props = {
  task: TaskProductionNoOperationDate;
}

export default function TaskUnscheduled({ task }: Props) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date')!;
  const params = useParams();
  const plan_id = params.plan_id!!;
  const queryClient = useQueryClient();

  const filtersNoOperationDate = useAppStore((state) => state.filtersNoOperationDate);
  const filtersWithOperationDate = useAppStore((state) => state.filtersWithOperationDate);

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: assignOperationDate,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['getWeeklyProductionPlanEvents', plan_id] });
      queryClient.invalidateQueries({ queryKey: ['getTasksNoOperationDate', plan_id, filtersNoOperationDate] });
      queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', plan_id, date, filtersWithOperationDate] });
      queryClient.invalidateQueries({ queryKey: ['getLineHoursPerWeek', plan_id] });

    }
  });

  return (
    <div className="border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">
      <div className="p-6 space-y-2 text-gray-700 text-base leading-relaxed">
        <p><span className="font-semibold text-gray-900">SKU:</span> {task.sku}</p>
        <p><span className="font-semibold text-gray-900">Línea:</span> {task.line}</p>
        <p><span className="font-semibold text-gray-900">Total libras:</span> {task.total_lbs}</p>
        <p><span className="font-semibold text-gray-900">Destino:</span> {task.destination}</p>
      </div>

      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 flex-col">
        <button
          disabled={!date || isPending}
          onClick={() => mutate({ id: task.id, date: date })}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium transition-all 
            ${date ? 'bg-white hover:border-gray-400 hover:shadow-md text-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Asignar a fecha:</span>
          <span className="font-semibold">{date || 'Ninguna'}</span>
        </button>

        <button
          onClick={() => navigate(`${location.pathname}?reprogramTask=${task.id}`, { replace: true })}
          className={'inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium transition-all hover:bg-gray-200'}
        >
          <Divide className="w-4 h-4" />
          <p>Dividr tarea</p>
        </button>
      </div>
    </div>
  );
}
