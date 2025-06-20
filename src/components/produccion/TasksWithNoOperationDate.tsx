import { Linea } from "@/api/LineasAPI";
import { getTasksNoOperationDate } from "@/api/WeeklyProductionPlanAPI";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import TaskUnscheduled from "./TaskUnscheduled";
import Spinner from "../utilities-components/Spinner";

export type TaskProductionUnscheduledFilters = {
    sku: string;
    line: string;
}

type Props = {
    lines: Linea[];
}

export default function TasksWithNoOperationDate({ lines }: Props) {
    const params = useParams();
    const plan_id = params.plan_id!!;
    const [filters, setFilters] = useState<TaskProductionUnscheduledFilters>({
        sku: '',
        line: ''
    });

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['getTasksNoOperationDate', plan_id, filters],
        queryFn: () => getTasksNoOperationDate({ id: plan_id, filters }),
    });

    const linesOptions = lines?.map((line) => ({
        value: line.id,
        label: `${line.name}`,
    }));


    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.id]: e.target.value });
    }

    return (
        <div className="w-96 p-0 border border-gray-200 rounded-2xl bg-white shadow-lg overflow-y-auto scrollbar-hide max-h-screen">
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
                            onChange={(e) => handleOnChange(e)}
                        />
                    </div>
                </div>

                <select className="border px-3 py-2 rounded-md w-full" id='line' onChange={(e) => handleOnChange(e)}>
                    <option value="">Todas las Líneas</option>
                    {linesOptions?.map((line) => (
                        <option key={line.value} value={line.value}>{line.label}</option>
                    ))}
                </select>
            </div>

            <div className="p-6 space-y-4">
                {isLoading ? (
                    <Spinner />
                ) : tasks?.length === 0 ? (
                    <p className="text-center text-gray-500">No existen tareas sin programación</p>
                ) : (
                    tasks?.map(task => <TaskUnscheduled key={task.id} task={task} filters={filters} />)
                )}
            </div>
        </div>
    )
}
