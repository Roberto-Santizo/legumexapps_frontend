import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskProductionNote, TaskByLine } from "@/api/WeeklyProductionPlanAPI";
import { toast } from "react-toastify";
import Error from "@/components/Error";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";

type Props = {
    modalNotas: boolean;
    setModalNotas: Dispatch<React.SetStateAction<boolean>>;
    task: TaskByLine;
    setSelectedTask: Dispatch<React.SetStateAction<TaskByLine>>;
}

export type DraftNote = {
    reason: string;
    action: string;
}

export default function ModalNotasProblemas({ modalNotas, setModalNotas, setSelectedTask, task }: Props) {
    const queryClient = useQueryClient();
    const params = useParams();
    const plan_id = params.plan_id!!;
    const linea_id = params.linea_id!!;

    const { mutate, isPending } = useMutation({
        mutationFn: createTaskProductionNote,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            setModalNotas(false);
            setSelectedTask({} as TaskByLine);
            queryClient.invalidateQueries({ queryKey: ['getTasksByLineId', plan_id, linea_id] })
        }
    });

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<DraftNote>();

    const onSubmit = (FormData: DraftNote) => {
        const data = {
            reason: FormData.reason,
            action: FormData.action,
            task_p_id: task.id
        }
        mutate(data);
    }
    return (
        <Transition appear show={modalNotas} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={() => setModalNotas(false)}>
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-2xl w-full max-w-2xl">
                                <div className="flex justify-between items-center bg-indigo-700 px-6 py-4 text-white">
                                    <h3 className="text-lg font-semibold uppercase">Nota</h3>
                                    <button
                                        className="text-white hover:text-gray-300 text-xl"
                                        onClick={() => setModalNotas(false)}
                                    >
                                        &times;
                                    </button>
                                </div>

                                <form className="p-6 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-4">
                                        <label htmlFor="reason" className="text-lg font-bold uppercase">Problema</label>
                                        <textarea
                                            id="reason"
                                            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                                            placeholder="Describe el problema"
                                            {...register("reason", { required: 'La descripción del problema es requerido', maxLength: { value: 255, message: 'El valor maximo del reporte es de 255 caracteres' } })}
                                        />
                                        {errors.reason?.message && <Error>{errors.reason?.message}</Error>}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="action" className="text-lg font-bold uppercase">Acción Tomada</label>
                                        <textarea
                                            id="action"
                                            className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                                            placeholder="Describe la acción tomada"
                                            {...register("action", { required: 'La descripción de la acción es requerida', maxLength: { value: 255, message: 'El valor maximo del reporte es de 255 caracteres' } })}
                                        />
                                        {errors.action?.message && <Error>{errors.action?.message}</Error>}
                                    </div>

                                    <button disabled={isPending} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                                        {isPending ? <Spinner /> : <p>Registrar Nota</p>}
                                    </button>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
