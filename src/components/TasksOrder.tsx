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
        return tasks?.map(task => task.priority)
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
                const activeIndex = tasks.findIndex(task => task.priority === activeId);
                const overIndex = tasks.findIndex(task => task.priority === overId);

                return arrayMove(tasks, activeIndex, overIndex);
            }

            const UpdatedTasks = newTasks();

            const reorderIds = UpdatedTasks.map(task => {
                return task.id
            });

            mutate(reorderIds);
            setTasks(UpdatedTasks);
        }
    };

    if (isError) return <ShowErrorAPI />

    if (tasks && itemsId) return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {
                navigate(location.pathname);
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
                    <div className="fixed inset-0 bg-black bg-opacity-70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white shadow-xl sm:w-full sm:max-w-3xl">
                                <div className="mt-10 p-10">
                                    <table className="table">
                                        <thead>
                                            <tr className="thead-tr">
                                                <th className="thead-tr">Linea</th>
                                                <th className="thead-tr">Total Horas del Día</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.summary.map(item => (
                                                <tr className="tbody-tr">
                                                    <td className="tbody-td">{item.line}</td>
                                                    <td className="tbody-td">{item.total_hours} horas</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-5 w-full">
                                    {(!isFetching && !isLoading && tasks.length === 0) && <p className="font-bold text-xl">No existen tareas en esta fecha</p>}
                                    <DndContext onDragEnd={onDragEnd}>
                                        <SortableContext items={itemsId}>
                                            {tasks.map(task => (
                                                <TaskProductionComponent key={task.id} task={task} isDraggable={task.end_date ? false : true} />
                                            ))}
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
