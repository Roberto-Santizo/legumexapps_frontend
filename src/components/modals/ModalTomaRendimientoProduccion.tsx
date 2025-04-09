import { createTaskProductionPerformance, TaskByLine, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { Dispatch } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";

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

    const { mutate, isPending } = useMutation({
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
        <Modal modal={modal} closeModal={() => setModal(false)} title="Toma de Rendimiento">
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

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                    {isPending ? <Spinner /> : <p>Guardar Registro</p>}
                </button>
            </form>
        </Modal>
    );
}
