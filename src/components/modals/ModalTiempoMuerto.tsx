import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { createTaskTimeout, getTimeOuts } from "@/api/TimeOutsAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TaskProductionPlan } from "@/types/taskProductionPlanTypes";
import Modal from "../Modal";
import InputSelectSearchComponent from "../form/InputSelectSearchComponent";
import Error from "../utilities-components/Error";
import Spinner from "../utilities-components/Spinner";
import { useNotification } from "../../core/notifications/NotificationContext";

export type DraftTaskTimeout = {
    timeout_id: string,
    id: TaskProductionPlan['id']
}

export default function ModalTiempoMuerto() {
    const params = useParams();
    const plan_id = params.plan_id!;
    const linea_id = params.linea_id!;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('TaskId')!;
    const modal = queryParams.get('modal')!;
    const show = (taskId && +modal === 3) ? true : false;
    const navigate = useNavigate();
    const notify = useNotification();


    const queryClient = useQueryClient();

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<DraftTaskTimeout>();

    const { mutate, isPending } = useMutation({
        mutationFn: createTaskTimeout,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: () => {
            notify.success('Tiempo muerto agregado correctamente');
            queryClient.invalidateQueries({ queryKey: ['getTasksByLineId', plan_id, linea_id] })
            navigate(location.pathname, { replace: true });
            reset();
        }
    });
    const { data: timeouts } = useQuery({
        queryKey: ['getAllTimeouts'],
        queryFn: () => getTimeOuts({ page: 1, paginated: '' })
    });

    const timeoutsOptions = timeouts?.data.map((timeout) => ({
        value: timeout.id,
        label: `${timeout.name}`,
    }));


    const onSubmit = (FormData: DraftTaskTimeout) => {
        const data = {
            timeout_id: FormData.timeout_id,
            id: taskId
        }
        mutate(data)
    }

    if (timeouts) return (
        <Modal modal={show} closeModal={() => navigate(location.pathname, { replace: true })} title="Agregar Tiempo Muerto">
            <form className="p-10 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                <InputSelectSearchComponent<DraftTaskTimeout>
                    label="Tiempo Muerto"
                    id="timeout_id"
                    name="timeout_id"
                    options={timeoutsOptions ?? []}
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
