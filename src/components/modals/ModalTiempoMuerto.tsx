import { TaskByLine, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { Dispatch } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { createTaskTimeout, getAllTimeouts } from "@/api/TimeOutsAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Modal from "../Modal";
import InputSelectSearchComponent from "../form/InputSelectSearchComponent";
import Error from "../utilities-components/Error";
import Spinner from "../utilities-components/Spinner";

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
            <form className="p-10 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                <InputSelectSearchComponent<DraftTaskTimeout>
                    label="Tiempo Muerto"
                    id="timeout_id"
                    name="timeout_id"
                    options={timeouts}
                    control={control}
                    rules={{ required: 'Seleccione un tiempo muerto' }}
                    errors={errors}
                >
                    {errors.timeout_id && <Error>{errors.timeout_id?.message?.toString()}</Error>}
                </InputSelectSearchComponent>

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                    {isPending ? <Spinner /> : <p>Iniciar</p>}
                </button>
            </form>
        </Modal>
    )
}
