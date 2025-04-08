import { createTaskProductionPerformance, TaskByLine, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

type Props = {
    task: TaskByLine;
    modal: boolean;
    setModal: Dispatch<React.SetStateAction<boolean>>;
    setSelectedTask: Dispatch<React.SetStateAction<TaskByLine>>;
}

export type DraftPerformance = {
    tarimas_produced: number;
    lbs_bascula: number;
}

export default function ModalTomaRendimientoProduccion({ task, modal, setModal, setSelectedTask }: Props) {

    const { mutate } = useMutation({
        mutationFn: ({ id, data }: { id: TaskProduction['id'], data: DraftPerformance }) => createTaskProductionPerformance(id, data),
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            setSelectedTask({} as TaskByLine)
            setModal(false);
        }
    })

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<DraftPerformance>();


    const onSubmit = (data: DraftPerformance) => mutate({ id: task.id, data });
    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={() => setModal(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 ">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-2xl w-full max-w-2xl">
                                <div className="flex justify-between items-center bg-indigo-700 px-6 py-4 text-white">
                                    <h3 className="text-lg font-semibold uppercase">
                                        Toma Rendimiento {task.sku} - {task.operation_date}
                                    </h3>
                                    <button
                                        className="text-white hover:text-gray-300 text-xl"
                                        onClick={() => setModal(false)}
                                    >
                                        &times;
                                    </button>
                                </div>

                                <form className="p-6 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2" htmlFor="tarimas_produced">
                                            Tarimas Producidas:
                                        </label>
                                        <input
                                            autoComplete="off"
                                            id="tarimas_produced"
                                            type="number"
                                            placeholder="Total de tarimas producidas"
                                            className="border border-gray-300 p-3 w-full rounded-md"
                                            {...register('tarimas_produced')}
                                        />
                                        {errors.tarimas_produced?.message && (
                                            <p className="text-red-600 text-sm mt-1">{errors.tarimas_produced.message.toString()}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2" htmlFor="lbs_bascula">
                                            Libras Báscula:
                                        </label>
                                        <input
                                            autoComplete="off"
                                            id="lbs_bascula"
                                            type="number"
                                            placeholder="Total de tarimas producidas"
                                            className="border border-gray-300 p-3 w-full rounded-md"
                                            {...register('lbs_bascula', { required: 'El total de libras de la tarima son necesarias' })}
                                        />
                                        {errors.lbs_bascula?.message && (
                                            <p className="text-red-600 text-sm mt-1">{errors.lbs_bascula.message.toString()}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded-md transition-all uppercase"
                                    >
                                        Registrar Rendimiento
                                    </button>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
