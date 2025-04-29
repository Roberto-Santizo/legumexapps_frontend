import { TaskWeeklyPlanByDate } from "@/api/WeeklyPlansAPI";
import { formatDate } from "@/helpers";
import { CalendarDays, CheckCircle2Icon, MapPin, Package } from "lucide-react";
import { QueryObserverResult, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { changePreparedInsumosState } from "@/api/TasksWeeklyPlanAPI";
import Spinner from "../utilities-components/Spinner";

type Props = {
    task: TaskWeeklyPlanByDate;
    refetch: () => Promise<QueryObserverResult<TaskWeeklyPlanByDate[]>>;
};

export default function TaskByDate({ task, refetch }: Props) {
    const { mutate, isPending } = useMutation({
        mutationFn: changePreparedInsumosState,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            refetch();
        }
    });

    return (
        <div className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-all flex justify-between">
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{task.task}</h2>

                <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{task.lote}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                    <CalendarDays className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{formatDate(task.operation_date)}</span>
                </div>

                <div>
                    <div className="flex items-center mb-1 text-sm font-medium text-gray-700">
                        <Package className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Insumos</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-gray-600 pl-1">
                        {task.insumos.map((insumo, idx) => (
                            <li key={idx}>
                                {`${insumo.name} - ${insumo.assigned_quantity} ${insumo.measure}`}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {task.status ? (
                <CheckCircle2Icon className="text-green-500" />
            ) : (
                <>
                    {isPending ? (
                        <Spinner />
                    ) : (
                        <CheckCircle2Icon className="cursor-pointer hover:text-gray-400" onClick={() => mutate(task.id)} />
                    )}
                </>
            )}
        </div>
    );
}
