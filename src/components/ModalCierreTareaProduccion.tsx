import { closeTaskProduction, TaskByLine, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { Dialog, Transition } from "@headlessui/react";
import { QueryObserverResult } from "@tanstack/react-query";
import { Dispatch, Fragment } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

type Props = {
    task: TaskByLine;
    setModalCierre: Dispatch<React.SetStateAction<boolean>>;
    modal: boolean;
    refetch: () => Promise<QueryObserverResult<TaskByLine[]>>;
    setSelectedTask: Dispatch<React.SetStateAction<TaskByLine>>;
}

export type DraftCloseTask = {
    total_tarimas: number;
    total_lbs_bascula: number;
}

export default function ModalCierreTareaProduccion({ task, setModalCierre, modal, setSelectedTask, refetch }: Props) {
    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, data }: { id: TaskProduction['id'], data: DraftCloseTask }) => closeTaskProduction(id, data),
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            setModalCierre(false);
            setSelectedTask({} as TaskByLine);
            refetch();
        }
    });

    const {
        handleSubmit,
        register,
        formState: { errors },
    }
        = useForm<DraftCloseTask>();

    const onSubmit = (data: DraftCloseTask) => mutate({ id: task.id, data });

    return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setModalCierre(false)}>
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

                <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl">
                            <div className="flex justify-between items-center bg-indigo-600 px-6 py-4 text-white rounded-t-2xl">
                                <h3 className="text-xl font-bold uppercase">
                                    Cierre de Tarea {task.sku}
                                </h3>
                                <button className="text-white hover:text-gray-300" onClick={() => setModalCierre(false)}>
                                    ✕
                                </button>
                            </div>

                            <form className="p-10 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-2">
                                    <label className="text-lg font-bold uppercase" htmlFor="total_tarimas">
                                        Tarimas Producidas:
                                    </label>
                                    <input
                                        autoComplete="off"
                                        id="total_tarimas"
                                        type="number"
                                        placeholder="Total de tarimas producidas"
                                        className="border border-gray-300 p-3 rounded-md"
                                        {...register('total_tarimas', { required: 'El total de tarimas producidas es necesario' })}
                                    />
                                    {errors.total_tarimas?.message && <p className="text-red-500">{errors.total_tarimas.message.toString()}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-lg font-bold uppercase" htmlFor="total_lbs_bascula">
                                        Total de Libras Producidas (báscula):
                                    </label>
                                    <input
                                        autoComplete="off"
                                        id="total_lbs_bascula"
                                        type="number"
                                        placeholder="Total de libras producidas (báscula)"
                                        className="border border-gray-300 p-3 rounded-md"
                                        {...register('total_lbs_bascula', { required: 'El total de libras producidas es necesario' })}
                                    />
                                    {errors.total_lbs_bascula?.message && <p className="text-red-500">{errors.total_lbs_bascula.message.toString()}</p>}
                                </div>


                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="button bg-indigo-500 hover:bg-indigo-600 w-full"
                                >
                                    {isPending ? "Procesando..." : "Cerrar Tarea"}
                                </button>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
