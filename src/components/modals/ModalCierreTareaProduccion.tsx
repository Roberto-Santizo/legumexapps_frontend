import { closeTaskProduction, TaskByLine, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { QueryObserverResult } from "@tanstack/react-query";
import { Dispatch } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Modal from "../Modal";
import InputComponent from "../form/InputComponent";
import Error from "../utilities-components/Error";

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
    } = useForm<DraftCloseTask>();

    const onSubmit = (data: DraftCloseTask) => mutate({ id: task.id, data });

    return (
        <Modal modal={modal} closeModal={() => setModalCierre(false)} title="Cierre de Tarea">
            <form className="p-10 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>

                <InputComponent<DraftCloseTask>
                    label="Tarimas Producidas"
                    id="total_tarimas"
                    name="total_tarimas"
                    placeholder="Total de Tarimas Producidas"
                    register={register}
                    validation={{}}
                    errors={errors}
                    type={'number'}
                >
                    {errors.total_tarimas && <Error>{errors.total_tarimas?.message?.toString()}</Error>}
                </InputComponent>

                <InputComponent<DraftCloseTask>
                    label="Total de Libras Producidas (báscula)"
                    id="total_lbs_bascula"
                    name="total_lbs_bascula"
                    placeholder="Total de libras producidas pesadas en báscula"
                    register={register}
                    validation={{ required: 'El total de libras producidas es obligatoria' }}
                    errors={errors}
                    type={'number'}
                >
                    {errors.total_lbs_bascula && <Error>{errors.total_lbs_bascula?.message?.toString()}</Error>}
                </InputComponent>

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
