import { assignOperationDate, TaskProductionNoOperationDate } from "@/api/WeeklyProductionPlanAPI";
import { Calendar } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";

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

  const { mutate, isPending } = useMutation({
    mutationFn: assignOperationDate,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ['getTasksNoOperationDate', plan_id] });
      queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', date] });
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

      <div className="bg-gray-50 px-6 py-4 flex justify-end">
        <button
          disabled={!date || isPending}
          onClick={() => mutate({ id: task.id, date: date })}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium transition-all 
            ${date ? 'bg-white hover:border-gray-400 hover:shadow-md text-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Asignar a fecha:</span>
          <span className="font-semibold">{date || 'Ninguna'}</span>
        </button>
      </div>
    </div>
  );
}
