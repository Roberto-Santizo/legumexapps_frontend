import { closeTaskProduction, TaskByLine, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { QueryObserverResult } from "@tanstack/react-query";
import { Dispatch } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Modal from "../Modal";

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
        <Modal modal={modal} closeModal={() => setModalCierre(false)} title="Cierre de Tarea">
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
                        {...register('total_tarimas')}
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
        </Modal>

    );
}
