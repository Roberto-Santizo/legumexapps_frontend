import { closeTaskProduction, TaskByLine, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { Dialog, Transition } from "@headlessui/react";
import { QueryObserverResult } from "@tanstack/react-query";
import { Dispatch, Fragment } from "react";
import { useForm } from "react-hook-form";
import Error from "./Error";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

type Props = {
    task: TaskByLine;
    setModalCierre: Dispatch<React.SetStateAction<boolean>>;
    modal: boolean;
    refetch: () => Promise<QueryObserverResult<TaskByLine[]>>;
    setSelectedTask: Dispatch<React.SetStateAction<TaskProduction>>;
}

export type DraftCloseTask = {
    total_tarimas: number;
}

export default function ModalCierreTareaProduccion({ task, setModalCierre, modal, setSelectedTask, refetch }: Props) {
    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, data }: { id: TaskProduction['id'], data: DraftCloseTask }) => closeTaskProduction(id, data),
        onError: () => {
            toast.error('Hubo un error al cerrar la tarea');
        },
        onSuccess: () => {
            toast.success('Tarea cerrada correctamente');
            setModalCierre(false);
            setSelectedTask({} as TaskProduction);
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
            <Dialog as="div" className="relative z-10" onClose={() => { setModalCierre(false) }}>
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
                    <div className="flex min-h-full items-center justify-center p-4">
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
                                <div className="flex justify-between items-center bg-indigo-600 px-6 py-4 text-white">
                                    <h3 className="text-xl font-bold uppercase">
                                        Cierre de Tarea {task.sku}
                                    </h3>
                                    <button
                                        className="text-white hover:text-gray-300"
                                        onClick={() => setModalCierre(false)}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form className="w-full mx-auto shadow p-10" noValidate onSubmit={handleSubmit(onSubmit)}>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-bold uppercase" htmlFor="total_tarimas">
                                            Tarimas Producidas:
                                        </label>
                                        <input
                                            autoComplete="off"
                                            id="total_tarimas"
                                            type="number"
                                            placeholder="Total de tarimas producidas"
                                            className="border border-black p-3"
                                            {...register('total_tarimas', { required: 'El total de tarimas producidas es necesaria' })}
                                        />
                                        {errors.total_tarimas?.message && <Error>{errors.total_tarimas.message.toString()}</Error>}
                                    </div>

                                    <Button
                                        disabled={isPending}
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ marginTop: 2 }}
                                    >
                                        {isPending ? (
                                            <Spinner />
                                        ) : (
                                            <p className="font-bold text-lg">Cerrar Tarea</p>
                                        )}
                                    </Button>

                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
