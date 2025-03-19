import { createTaskProductionPerformance, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { formatDate } from "@/helpers";
import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Error from "./Error";
import { Button } from "@mui/material";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

type Props = {
    task: TaskProduction;
    modal: boolean;
    setModal: Dispatch<React.SetStateAction<boolean>>;
    setSelectedTask: Dispatch<React.SetStateAction<TaskProduction>>;
}

export type DraftPerformance = {
    tarimas_produced: number;
}

export default function ModalTomaRendimientoProduccion({ task, modal, setModal }: Props) {

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, data }: { id: TaskProduction['id'], data: DraftPerformance }) => createTaskProductionPerformance(id, data),
        onError: () => {
            toast.error('Ocurrio un error al tomar el rendimiento');
        },
        onSuccess: () => {
            toast.success('Rendimiento tomado correctamente');
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
            <Dialog as="div" className="relative z-10" onClose={() => setModal(false)}>
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
                                        Toma Rendimiento {task.sku} - {formatDate(task.operation_date)}
                                    </h3>
                                    <button
                                        className="text-white hover:text-gray-300"
                                        onClick={() => setModal(false)}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form className="w-full mx-auto shadow p-10" noValidate onSubmit={handleSubmit(onSubmit)}>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-bold uppercase" htmlFor="tarimas_produced">
                                            Tarimas Producidas:
                                        </label>
                                        <input
                                            autoComplete="off"
                                            id="tarimas_produced"
                                            type="number"
                                            placeholder="Total de tarimas producidas"
                                            className="border border-black p-3"
                                            {...register('tarimas_produced', { required: 'El total de tarimas producidas es necesaria' })}
                                        />
                                        {errors.tarimas_produced?.message && <Error>{errors.tarimas_produced.message.toString()}</Error>}
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
                                            <p className="font-bold text-lg">Tomar Rendimiento</p>
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
