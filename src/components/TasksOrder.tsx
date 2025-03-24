import { DndContext, DragOverEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import TaskProductionComponent from "@/components/TaskProductionComponent";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState, Fragment, Dispatch, SetStateAction } from "react";
import { changeTasksPriority, getTasksProductionByDate, TaskByDate } from "@/api/WeeklyProductionPlanAPI";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import ShowErrorAPI from "./ShowErrorAPI";
import LoadingOverlay from "./LoadingOverlay";
import Spinner from "./Spinner";

type Props = {
    setModalTasks: Dispatch<SetStateAction<boolean>>;
    date: string;
}

export default function TasksOrder({ setModalTasks, date }: Props) {
    const params = useParams();
    const plan_id = params.plan_id!!;

    const [tasks, setTasks] = useState<TaskByDate[]>([]);

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['getTasksProductionByDate', plan_id, date],
        queryFn: () => getTasksProductionByDate(plan_id, date)
    });

    const { mutate } = useMutation({
        mutationFn: changeTasksPriority,
        onError: () => {
            toast.error('Hubo un error al cambiar la prioridad');
        },
        onSuccess: () => {
            toast.success('Prioridad Cambiada Correctamente');
        }
    });

    useEffect(() => {
        if (data) {
            setTasks(data);
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

    useEffect(() => {
        refetch();
    }, [date]);

    if (isLoading) return <LoadingOverlay />
    if (isError) return <ShowErrorAPI />

    if (tasks && itemsId) return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setModalTasks(false)}>
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
                                <div className="p-5">
                                    {(!isFetching && !isLoading && tasks.length === 0) && <p className="font-bold text-xl">No existen tareas en esta fecha</p>}
                                    {isFetching ? <Spinner /> : (
                                        <>
                                            <DndContext onDragEnd={onDragEnd}>
                                                <SortableContext items={itemsId}>
                                                    {tasks.map(task => (
                                                        <TaskProductionComponent key={task.id} task={task} />
                                                    ))}
                                                </SortableContext>
                                            </DndContext>
                                        </>
                                    )}
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
