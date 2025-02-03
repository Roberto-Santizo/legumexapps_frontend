import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useAppStore } from "../stores/useAppStore";
import { TaskWeeklyPlan } from "../types";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

export default function InsumosModal() {
    const [loading, setLoading] = useState<boolean>(false);
    const [task, setTask] = useState<TaskWeeklyPlan>({} as TaskWeeklyPlan);
    const modal = useAppStore((state) => state.OpenModalInsumos);
    const closeModal = useAppStore((state) => state.closeModalAction);
    const getTask = useAppStore((state) => state.getTask);
    const idTask = useAppStore((state) => state.idTask);

    const handleGetTask = async () => {
        setLoading(true);
        try {
            if (idTask) {
                const task = await getTask(idTask);
                setTask(task);
            }
        } catch (error) {
            toast.error('Error al traer la tarea, intentelo de nuevo más tarde');
            closeModal();
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        handleGetTask()
    }, [idTask])
    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                                <div className="p-10">
                                    {loading && <Spinner />}
                                    {(!loading && task) && (
                                        <>
                                            <h2>Insumos Asignados:</h2>
                                            {task.insumos.map(insumo => (
                                                <p>{insumo.name}</p>
                                            ))}
                                        </>
                                    )}
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
