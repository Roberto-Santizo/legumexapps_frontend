import { SetStateAction } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeOperationDate, getFincaGroups } from "@/api/TasksWeeklyPlanAPI";
import { useNotification } from "../../core/notifications/NotificationContext";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import InputSelectComponent from "../form/InputSelectComponent";
import Error from "../utilities-components/Error";
import InputComponent from "../form/InputComponent";

type Props = {
    show: boolean;
    setModal: React.Dispatch<SetStateAction<boolean>>;
    id: string;
    ids: string[];
    setIds: React.Dispatch<SetStateAction<string[]>>;
}

export default function ModalChangeOperationDateAgricola({ show, setModal, ids, id, setIds }: Props) {
    const queryClient = useQueryClient();
    const notify = useNotification();
    const params = useParams();
    const fincaId = params.finca_id!!;

    const { data: groups } = useQuery({
        queryKey: ['getFincaGroups', fincaId, id],
        queryFn: () => getFincaGroups({ fincaId, plan: id }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<{ group_id: string, date: string }>();

    const { mutate, isPending } = useMutation({
        mutationFn: changeOperationDate,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (data) => {
            notify.success(data ?? '');
            setModal(false);
            queryClient.invalidateQueries({ queryKey: ['getTasksNoPlanificationDate', id] });
            queryClient.invalidateQueries({ queryKey: ['getTasksForCalendar', id] });
            setIds([]);
            reset();
        },
    });

    const groupsOptions = groups?.map((group) => ({
        value: `${group.id}`,
        label: `${group.code}`,
    }));


    const onSubmit = (data: { group_id: string, date: string }) => {
        mutate({ date: data.date, group_id: data.group_id, ids })
    }

    if (groupsOptions) return (
        <Modal modal={show} closeModal={() => setModal(false)} title="Cambio de Fecha de Operación">
            <form className="p-10 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                <InputSelectComponent<{ group_id: string, date: string }>
                    label="Grupo"
                    id="group_id"
                    name="group_id"
                    options={groupsOptions}
                    register={register}
                    validation={{ required: 'El grupo es obligatario' }}
                    errors={errors}
                >
                    {errors.group_id && <Error>{errors.group_id?.message?.toString()}</Error>}
                </InputSelectComponent>

                <InputComponent<{ group_id: string, date: string }>
                    label="Fecha de operación"
                    id="date"
                    name="date"
                    register={register}
                    validation={{ required: 'La fecha es requerida' }}
                    errors={errors}
                    type={'date'}
                >
                    {errors.date && <Error>{errors.date?.message?.toString()}</Error>}
                </InputComponent>

                <button disabled={isPending || ids.length === 0} className={`button ${ids.length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'}  w-full`}>
                    {isPending ? <Spinner /> : <p>Guardar Fecha de Operación</p>}
                </button>
            </form>
        </Modal>
    )
}
