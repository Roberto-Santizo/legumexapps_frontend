import { useAppStore } from "@/store";
import { getTasksNoOperationDate } from "@/api/WeeklyProductionPlanAPI";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Line } from "types/linesTypes";
import TaskUnscheduled from "./TaskUnscheduled";
import Spinner from "../utilities-components/Spinner";

type Props = {
    lines: Line[];
}

export default function TasksWithNoOperationDate({ lines }: Props) {
    const params = useParams();
    const plan_id = params.plan_id!!;

    const linesOptions = lines?.map((line) => ({
        value: line.id,
        label: `${line.name}`,
    }));

    const handleChangefiltersNoOperationDate = useAppStore((state) => state.handleChangefiltersNoOperationDate);
    const filtersNoOperationDate = useAppStore((state) => state.filtersNoOperationDate);

    const { data: tasks, isLoading, isFetching } = useQuery({
        queryKey: ['getTasksNoOperationDate', plan_id, filtersNoOperationDate],
        queryFn: () => getTasksNoOperationDate({ id: plan_id, filters: filtersNoOperationDate }),
        refetchOnWindowFocus: false
    });

    const isUpdating = useMemo(() => isLoading || isFetching, [isLoading, isFetching]);

    return (
        <div className="xl:w-96 p-0 border border-gray-200 rounded-2xl bg-white shadow-lg overflow-y-auto scrollbar-hide max-h-screen">
            <div className="sticky top-0 z-10 bg-white p-6 border-b border-gray-200 space-y-5">
                <h2 className="text-xl font-extrabold uppercase tracking-wide text-gray-800 mb-4">Tareas sin programación</h2>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="sku" className="block text-sm font-semibold text-gray-700">SKU</label>
                        <input
                            id="sku"
                            type="text"
                            placeholder="Ingrese SKU"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleChangefiltersNoOperationDate(e)}
                            autoComplete="off"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="product" className="block text-sm font-semibold text-gray-700">Producto</label>
                        <input
                            id="product"
                            type="text"
                            placeholder="Ingrese nombre del producto"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleChangefiltersNoOperationDate(e)}
                            autoComplete="off"
                        />
                    </div>
                </div>

                <select className="border px-3 py-2 rounded-md w-full" id='line' onChange={(e) => handleChangefiltersNoOperationDate(e)}>
                    <option value="">Todas las Líneas</option>
                    {linesOptions?.map((line) => (
                        <option key={line.value} value={line.value}>{line.label}</option>
                    ))}
                </select>
            </div>

            <div className="p-6 space-y-4">
                <div className="space-y-4">
                    {isUpdating && <Spinner />}

                    {!isUpdating && tasks?.length === 0 && (
                        <p className="text-center">No existen tareas pendientes</p>
                    )}

                    {(!isUpdating && (tasks?.length ?? 0) > 0) && (
                        <>
                            {tasks?.map(task => (
                                <TaskUnscheduled key={task.id} task={task} />
                            ))}
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}
