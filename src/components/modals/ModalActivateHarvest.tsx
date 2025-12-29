import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCDPS } from "@/views/agricola/cdps/api/api";
import { FiltersTasksInitialValues } from "@/views/agricola/tasks/Index";
import { getTasks } from "@/api/TasksAPI";
import { createTaskCropWeeklyPlan } from "@/api/TaskCropWeeklyPlanAPI";
import { useNotification } from "@/core/notifications/NotificationContext";
import Modal from "../Modal";
import InputSelectSearchComponent from "../form/InputSelectSearchComponent";
import Error from "../utilities-components/Error";
import Spinner from "../utilities-components/Spinner";

export type DraftTaskCropWeeklyPlan = {
    weekly_plan_id: string;
    tarea_id: string;
    cdp_id: string;
}

export default function ModalActivateHarvest() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('activateHarvest')!;
    const show = modal ? true : false;
    const navigate = useNavigate();
    const params = useParams();
    const fincaId = params.finca_id!;
    const id = params.plan_id!;
    const notification = useNotification();


    const handleCloseModal = () => {
        navigate(location.pathname);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: createTaskCropWeeklyPlan,
        onSuccess: (data) => {
            notification.success(data!);
            handleCloseModal();
        },
        onError: (error) => {
            notification.error(error.message);
        }
    });

    const { data } = useQuery({
        queryKey: ['getPaginatedCDPS', fincaId],
        queryFn: () => getCDPS({ page: 1, filters: { cdp: '', end_date: '', start_date: '' }, paginated: '', finca: fincaId }),
    });

    const { data: tasks } = useQuery({
        queryKey: ['getAllTasks'],
        queryFn: () => getTasks({ page: 1, filters: FiltersTasksInitialValues, paginated: '' }),
    });

    const cdps = data?.data.map((cdp) => ({
        value: cdp.id,
        label: `${cdp.name}`,
    }));

    const tareasOptions = tasks?.data.map((lote) => ({
        value: lote.id,
        label: `${lote.code} ${lote.name}`,
    }));

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<DraftTaskCropWeeklyPlan>();


    const onSubmit = (data: DraftTaskCropWeeklyPlan) => {
        data.weekly_plan_id = id;
        mutate(data);
    }

    if (cdps) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Activación de Cosecha">
            <div className="p-10">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    noValidate
                >
                    <InputSelectSearchComponent<DraftTaskCropWeeklyPlan>
                        label="CDP"
                        id="cdp_id"
                        name="cdp_id"
                        options={cdps}
                        control={control}
                        rules={{ required: 'El CDP es obligatorio' }}
                        errors={errors}
                    >
                        {errors.cdp_id && <Error>{errors.cdp_id?.message?.toString()}</Error>}
                    </InputSelectSearchComponent>

                    <InputSelectSearchComponent<DraftTaskCropWeeklyPlan>
                        label="Tarea"
                        id="tarea_id"
                        name="tarea_id"
                        options={tareasOptions ? tareasOptions : []}
                        control={control}
                        rules={{ required: "La tarea a realizar es obligatoria" }}
                        errors={errors}
                    >
                        {errors.tarea_id && <Error>{errors.tarea_id?.message?.toString()}</Error>}
                    </InputSelectSearchComponent>

                    <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                        {isPending ? <Spinner /> : <p>Activar Tarea</p>}
                    </button>
                </form>
            </div>
        </Modal>
    )
}
