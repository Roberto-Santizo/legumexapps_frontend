import { TaskByLine, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { Dispatch } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { createTaskTimeout, getAllTimeouts } from "@/api/TimeOutsAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Modal from "../Modal";

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
        <Modal modal={modal} closeModal={() => setModalTimeout(false)} title="Agregar Tiempo Muerto">
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
        </Modal>
    )
}
