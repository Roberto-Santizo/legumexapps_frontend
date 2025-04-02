import { DndContext, DragOverEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState, Fragment } from "react";
import { changeTasksPriority, getTasksProductionByDate, TaskByDate } from "@/api/WeeklyProductionPlanAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import TaskProductionComponent from "@/components/TaskProductionComponent";
import ShowErrorAPI from "./ShowErrorAPI";

export default function TasksOrder() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date')!;
    const show = date ? true : false;

    const params = useParams();
    const plan_id = params.plan_id!!;

    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const [tasks, setTasks] = useState<TaskByDate[]>([]);
    const [lineId, setLineId] = useState<string>('');
    const [selectedTasks, setSelectedTasks] = useState<TaskByDate[]>([]);

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ['getTasksProductionByDate', plan_id, date],
        queryFn: () => getTasksProductionByDate(plan_id, date),
        enabled: !!date
    });

    const { mutate } = useMutation({
        mutationFn: changeTasksPriority,
        onError: () => {
            toast.error('Hubo un error al cambiar la prioridad');
        },
        onSuccess: () => {
            toast.success('Prioridad Cambiada Correctamente');
            queryClient.invalidateQueries({ queryKey: ['getTasksProductionByDate', plan_id, date] });
            queryClient.invalidateQueries({ queryKey: ['getAllTasksForCalendar', plan_id] });
        }
    });

    useEffect(() => {
        if (data) {
            setTasks(data.data);
        }
    }, [data]);

    const itemsId = useMemo(() => {
        return selectedTasks?.map(task => task.priority)
    }, [tasks]);

    const onDragEnd = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || !active) return;
        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;

        const isActiveEmployee = active.data.current?.type === "Task";
        const isOverEmployee = over.data.current?.type === "Task";

        if (isOverEmployee && isActiveEmployee) {
            const newTasks = () => {
                const activeIndex = selectedTasks.findIndex(task => task.priority === activeId);
                const overIndex = selectedTasks.findIndex(task => task.priority === overId);

                return arrayMove(selectedTasks, activeIndex, overIndex);
            }

            const UpdatedTasks = newTasks();

            const reorderIds = UpdatedTasks.map(task => {
                return task.id
            });

            mutate(reorderIds);
            setSelectedTasks(UpdatedTasks);
        }
    };

    const handleSelectTasks = (id: string) => {
        setLineId(id);
        const newTasks = tasks.filter(task => task.line_id === id);
        setSelectedTasks(newTasks);
    }

    if (isError) return <ShowErrorAPI />

    if (tasks && itemsId) return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => {
                navigate(location.pathname);
                setSelectedTasks([]);
                setLineId('');
            }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-6">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl p-6 transition-all">
                            <div className="w-full">
                                {(!isFetching && !isLoading && tasks.length === 0) ? (
                                    <p className="text-xl font-semibold text-gray-700 text-center">No existen tareas en esta fecha</p>
                                ) : (
                                    <>
                                        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm mt-5">
                                            <table className="w-full text-left text-gray-700">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-6 py-3 text-sm font-medium">Línea</th>
                                                        <th className="px-6 py-3 text-sm font-medium">Total Horas del Día</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data?.summary.map(item => (
                                                        <tr
                                                            key={item.line}
                                                            className={`cursor-pointer hover:bg-gray-50 transition ${lineId === item.id ? 'font-bold bg-gray-100' : ''}`}
                                                            onClick={() => handleSelectTasks(item.id)}
                                                        >
                                                            <td className="px-6 py-3 border-b">{item.line}</td>
                                                            <td className="px-6 py-3 border-b">{item.total_hours} horas</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <DndContext onDragEnd={onDragEnd}>
                                            <SortableContext items={itemsId}>
                                                <div className="mt-5 space-y-3">
                                                    {selectedTasks.map(task => (
                                                        <TaskProductionComponent
                                                            key={task.id}
                                                            task={task}
                                                            isDraggable={!task.end_date}
                                                        />
                                                    ))}
                                                </div>
                                            </SortableContext>
                                        </DndContext>
                                    </>
                                )}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}
