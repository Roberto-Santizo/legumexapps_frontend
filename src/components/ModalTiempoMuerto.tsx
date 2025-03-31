import { TaskByLine, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { Transition, Dialog } from "@headlessui/react";
import { Dispatch, Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { createTaskTimeout, getAllTimeouts } from "@/api/TimeOutsAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Select from "react-select";

type Props = {
    task: TaskByLine;
    modal: boolean;
    setSelectedTask: Dispatch<React.SetStateAction<TaskByLine>>;
    setModalTimeout: Dispatch<React.SetStateAction<boolean>>
}

export type DraftTaskTimeout = {
    timeout_id: string,
    id: TaskProduction['id']
}

export default function ModalTiempoMuerto({ setModalTimeout, modal, setSelectedTask, task }: Props) {
    const params = useParams();
    const plan_id = params.plan_id!!;
    const linea_id = params.linea_id!!;
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: createTaskTimeout,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success('Tiempo muerto agregado correctamente');
            setSelectedTask({} as TaskByLine);
            setModalTimeout(false);
            queryClient.invalidateQueries({ queryKey: ['getTasksByLineId', plan_id, linea_id] })
        }
    });
    const { data: timeouts } = useQuery({
        queryKey: ['getAllTimeouts'],
        queryFn: getAllTimeouts
    });

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<DraftTaskTimeout>();

    const onSubmit = (FormData: DraftTaskTimeout) => {
        const data = {
            timeout_id: FormData.timeout_id,
            id: task.id
        }

        mutate(data)
    }

    if (timeouts) return (
        <Transition appear show={modal} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={() => setModalTimeout(false)}>
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-2xl w-full max-w-2xl">
                                <div className="flex justify-between items-center bg-indigo-700 px-6 py-4 text-white">
                                    <h3 className="text-lg font-semibold uppercase">Agregar Tiempo Muerto - {task.sku}</h3>
                                    <button
                                        className="text-white hover:text-gray-300 text-xl"
                                        onClick={() => setModalTimeout(false)}
                                    >
                                        &times;
                                    </button>
                                </div>

                                <form className="p-6 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2" htmlFor="timeout_id">
                                            Tiempo Muerto
                                        </label>
                                        <Controller
                                            name="timeout_id"
                                            control={control}
                                            rules={{ required: "Seleccione un tiempo muerto" }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={timeouts}
                                                    id="timeout_id"
                                                    placeholder="-- SELECCIONE UNA OPCIÓN --"
                                                    classNamePrefix="react-select"
                                                    onChange={(selected) => field.onChange(selected?.value)}
                                                    value={timeouts.find(option => option.value === field.value)}
                                                />
                                            )}
                                        />
                                        {errors.timeout_id && (
                                            <p className="text-red-600 text-sm mt-1">{errors.timeout_id?.message?.toString()}</p>
                                        )}
                                    </div>

                                    <button
                                        disabled={isPending}
                                        type="submit"
                                        className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded-md transition-all uppercase"
                                    >
                                        {isPending ? (
                                            <span className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></span>
                                        ) : (
                                            "Agregar Tiempo Muerto"
                                        )}
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
