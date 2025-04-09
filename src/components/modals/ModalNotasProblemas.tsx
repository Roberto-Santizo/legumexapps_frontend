import { Dispatch } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskProductionNote, TaskByLine } from "@/api/WeeklyProductionPlanAPI";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";
import Modal from "../Modal";

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
        <Modal modal={modalNotas} closeModal={() => setModalNotas(false)} title="Agregar Nota">
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
        </Modal>

    )
}
