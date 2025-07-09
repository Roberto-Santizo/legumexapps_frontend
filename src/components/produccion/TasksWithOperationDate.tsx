import { Linea } from "@/api/LineasAPI";
import { getTasksOperationDate } from "@/api/WeeklyProductionPlanAPI";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppStore } from "@/store";
import Spinner from "../utilities-components/Spinner";
import TaskScheduled from "./TaskScheduled";

type Props = {
    lines: Linea[];
}

const statuses = [
    { value: '1', label: 'Pendiente entrega de material de empaque' },
    { value: '2', label: 'Lista para confirmación de asignaciones' },
    { value: '3', label: 'Lista para ejecución' },
    { value: '4', label: 'En progreso' },
    { value: '5', label: 'Finalizada' }
];

export default function TasksWithOperationDate({ lines }: Props) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date') ?? '';
    const params = useParams();
    const plan_id = params.plan_id!!;

    const filters = useAppStore((state) => state.filtersWithOperationDate);
    const handleChangefiltersOperationDate = useAppStore((state) => state.handleChangefiltersOperationDate);

    const { data: tasks, isLoading, isFetching } = useQuery({
        queryKey: ['getTasksOperationDate', plan_id, date, filters],
        queryFn: () => getTasksOperationDate({ id: plan_id, date, filters }),
        enabled: !!date,
        refetchOnWindowFocus: false
    });

    const linesOptions = lines?.map((line) => ({
        value: line.id,
        label: `${line.name}`,
    }));

    const isUpdating = useMemo(() => isFetching || isLoading, [isFetching, isLoading])
    return (
        <div className="border-t pt-4">
            <h2 className="text-2xl font-bold">Tareas programadas: {date}</h2>
            <div className='mt-5 flex flex-col gap-5'>
                <div className="space-y-1">
                    <label htmlFor="sku" className="block text-sm font-semibold text-gray-700">SKU</label>
                    <input
                        id="sku"
                        type="text"
                        placeholder="Ingrese SKU"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => handleChangefiltersOperationDate(e)}
                    />
                </div>

                <div className='flex gap-5'>
                    <select className="border px-3 py-2 rounded-md w-full" id='line'
                        onChange={(e) => handleChangefiltersOperationDate(e)}
                    >
                        <option value="">Todas las Líneas</option>
                        {linesOptions?.map((line) => (
                            <option key={line.value} value={line.value}>{line.label}</option>
                        ))}
                    </select>

                    <select className="border px-3 py-2 rounded-md w-full" id='status'
                        onChange={(e) => handleChangefiltersOperationDate(e)}
                    >
                        <option value="">Todos los estados</option>
                        {statuses.map((status) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                    </select>
                </div>

            </div>
            <div className='mt-5 overflow-y-auto scrollbar-hide max-h-96 space-y-6'>
                {isUpdating && <Spinner />}

                {(!isUpdating && tasks?.length === 0) && <p className='text-center'>No existen tareas programadas para esta fecha</p>}

                {(!isUpdating && (tasks?.length ?? 0) > 0) && (
                    <>
                        {tasks?.map(task => (
                            <TaskScheduled key={task.id} task={task} />
                        ))}
                    </>
                )}


            </div>
        </div>
    )
}
