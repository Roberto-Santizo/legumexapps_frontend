import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { editTask, getFincaGroups, getTaskInfoToEdit } from '@/api/TasksWeeklyPlanAPI';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { getWeeklyPlans } from '@/api/WeeklyPlansAPI';
import { useNotification } from '@/core/notifications/NotificationContext';
import Modal from '../Modal';
import InputSelectComponent from '../form/InputSelectComponent';
import Spinner from '../utilities-components/Spinner';
import Error from '../utilities-components/Error';
import InputComponent from '../form/InputComponent';

export type EditTaskWeeklyPlan = {
    finca_group_id: number;
    weekly_plan_id: number;
    budget: number;
    hours: number;
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    operation_date: string;
}

export default function ModalInfoTareaLote() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('infoTask')!;
    const show = id ? true : false;
    const navigate = useNavigate();
    const params = useParams();
    const plan_id = params.plan_id!;
    const fincaId = params.finca_id!;
    const notify = useNotification();

    const queryClient = useQueryClient();

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
        reset,
    } = useForm<EditTaskWeeklyPlan>();

    const { data: task, isLoading } = useQuery({
        queryKey: ['getTaskInfoToEdit', id],
        queryFn: () => getTaskInfoToEdit(id),
        enabled: show
    });

    const { data: plans } = useQuery({
        queryKey: ['getAllPlans'],
        queryFn: () => getWeeklyPlans({ page: 1, filters: { finca_id: "", week: "", year: "", }, paginated: '' }),
        enabled: show,
        retry: false
    });

    const handleClose = () => {
        navigate(location.pathname);
        reset();
    }

    const { mutate, isPending } = useMutation({
        mutationFn: editTask,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (data) => {
            notify.success(data!);
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['getTasksForCalendar', plan_id] });
        }
    });

    const { data: groups } = useQuery({
        queryKey: ['getFincaGroups', fincaId, plan_id],
        queryFn: () => getFincaGroups({ fincaId, plan: plan_id }),
    });

    const groupsOptions = groups?.map((group) => ({
        value: `${group.id}`,
        label: `${group.code}`,
    }));

    const plansOptions = plans?.data.map((plan) => ({
        value: `${plan.id}`,
        label: `${plan.finca} - ${plan.week} - ${plan.year}`,
    }));

    useEffect(() => {
        if (task) {
            setValue('finca_group_id', task.group_id!);
            setValue('weekly_plan_id', task.weekly_plan_id!);
            setValue('start_date', task.start_date!);
            setValue('start_time', task.start_time!);
            setValue('end_date', task.end_date!);
            setValue('end_time', task.end_time!);
            setValue('operation_date', task.operation_date!);
            setValue('budget', task.budget!);
            setValue('hours', task.hours!);
        }
    }, [task]);

    const onSubmit = (data: EditTaskWeeklyPlan) => {
        const start_date = (data.start_date && data.start_time) ? `${data.start_date} ${data.start_time}:00` : '';
        const end_date = (data.end_date && data.end_time) ? `${data.end_date} ${data.end_time}:00` : '';
        data.start_date = start_date;
        data.end_date = end_date;
        mutate({ FormData: data, id })
    }

    if (groupsOptions && plansOptions) return (
        <Modal modal={show} closeModal={() => handleClose()} title="Información de la Tarea">
            <div className="p-6 space-y-4 text-sm text-gray-700">

                {isLoading ? <Spinner /> : (
                    <form
                        className="space-y-5 mx-auto p-5"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        <InputComponent<EditTaskWeeklyPlan>
                            label="Presupuesto"
                            id="budget"
                            name="budget"
                            register={register}
                            placeholder={'Presupuesto de la tarea'}
                            validation={{ required: 'El presupuesto es requerido' }}
                            errors={errors}
                            type={'number'}
                        >
                            {errors.budget && <Error>{errors.budget?.message?.toString()}</Error>}
                        </InputComponent>

                        <InputComponent<EditTaskWeeklyPlan>
                            label="Horas"
                            id="hours"
                            name="hours"
                            register={register}
                            placeholder={'Horas teoricas'}
                            validation={{ required: 'Las horas son requeridas' }}
                            errors={errors}
                            type={'number'}
                        >
                            {errors.hours && <Error>{errors.hours?.message?.toString()}</Error>}
                        </InputComponent>

                        <InputComponent<EditTaskWeeklyPlan>
                            label="Fecha de Operacion"
                            id="operation_date"
                            name="operation_date"
                            register={register}
                            validation={{ required: 'La fecha de operación es obligatoria' }}
                            errors={errors}
                            type={'date'}
                        >
                            {errors.operation_date && <Error>{errors.operation_date?.message?.toString()}</Error>}
                        </InputComponent>

                        <InputSelectComponent<EditTaskWeeklyPlan>
                            label="Grupo"
                            id="finca_group_id"
                            name="finca_group_id"
                            options={groupsOptions}
                            register={register}
                            validation={{ required: 'El grupo es obligatario' }}
                            errors={errors}
                        >
                            {errors.finca_group_id && <Error>{errors.finca_group_id?.message?.toString()}</Error>}
                        </InputSelectComponent>

                        <InputSelectComponent<EditTaskWeeklyPlan>
                            label="Plan Semanal"
                            id="weekly_plan_id"
                            name="weekly_plan_id"
                            options={plansOptions}
                            register={register}
                            validation={{ required: 'El plan semanal es obligatario' }}
                            errors={errors}
                        >
                            {errors.weekly_plan_id && <Error>{errors.weekly_plan_id?.message?.toString()}</Error>}
                        </InputSelectComponent>

                        <InputComponent<EditTaskWeeklyPlan>
                            label="Fecha de Inicio"
                            id="start_date"
                            name="start_date"
                            register={register}
                            validation={{}}
                            errors={errors}
                            type={'date'}
                        >
                            {errors.start_date && <Error>{errors.start_date?.message?.toString()}</Error>}
                        </InputComponent>

                        <InputComponent<EditTaskWeeklyPlan>
                            label="Hora de Inicio"
                            id="start_time"
                            name="start_time"
                            placeholder=""
                            register={register}
                            validation={{}}
                            errors={errors}
                            type={'time'}
                        >
                            {errors.start_time && <Error>{errors.start_time?.message?.toString()}</Error>}
                        </InputComponent>

                        <InputComponent<EditTaskWeeklyPlan>
                            label="Fecha Final"
                            id="end_date"
                            name="end_date"
                            register={register}
                            validation={{}}
                            errors={errors}
                            type={'date'}
                        >
                            {errors.end_date && <Error>{errors.end_date?.message?.toString()}</Error>}
                        </InputComponent>

                        <InputComponent<EditTaskWeeklyPlan>
                            label="Hora Final"
                            id="end_time"
                            name="end_time"
                            placeholder=""
                            register={register}
                            validation={{}}
                            errors={errors}
                            type={'time'}
                        >
                            {errors.end_time && <Error>{errors.end_time?.message?.toString()}</Error>}
                        </InputComponent>

                        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full mt-5">
                            {isPending ? <Spinner /> : <p>Actualizar Tarea</p>}
                        </button>
                    </form>
                )}

            </div>
        </Modal>
    )
}
