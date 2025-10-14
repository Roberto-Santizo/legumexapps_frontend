import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDraftWeeklyPlans, getTaskWeeklyPlanDraftById, UpdateTaskWeeklyPlanDraft } from "@/api/PlannerFincasAPI";
import { useForm } from "react-hook-form";
import { DraftTaskPlantationControl } from "@/types/index";
import { useEffect } from "react";
import { useNotification } from "../../../../core/notifications/NotificationContext";
import Modal from "@/components/Modal";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";

export default function ModalEditTask() {
    const location = useLocation();
    const notify = useNotification();
    const params = useParams();
    const queryClient = useQueryClient();
    const id = params.id!;

    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('editTask')!;
    const show = taskId ? true : false;
    const [_, setSearchParams] = useSearchParams();

    const { data } = useQuery({
        queryKey: ['getTaskWeeklyPlanDraftById', taskId],
        queryFn: () => getTaskWeeklyPlanDraftById(parseInt(taskId)),
        enabled: !!taskId
    });

    const { data: plans } = useQuery({
        queryKey: ['getDraftWeeklyPlans'],
        queryFn: () => getDraftWeeklyPlans({}),
        enabled: !!taskId
    });

    const { mutate } = useMutation({
        mutationFn: UpdateTaskWeeklyPlanDraft,
        onSuccess: (message) => {
            notify.success(message ?? '');
            queryClient.invalidateQueries({ queryKey: ['getDraftWeeklyPlanById', id], });
            handleCloseModal();
        },
        onError: (error) => {
            notify.error(error.message);
        }
    });

    const plansOptions = plans?.data.map((plan) => ({
        value: `${plan.id}`,
        label: ` ${plan.finca} | S${plan.week} | ${plan.year}`,
    }));

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        control,
        reset
    } = useForm<DraftTaskPlantationControl>();

    const onSubmit = (data: DraftTaskPlantationControl) => {
        mutate({ id: parseInt(taskId), data: data });
    }

    useEffect(() => {
        if (data) {
            setValue('hours', data.hours);
            setValue('budget', data.budget);
            setValue('tags', data.tags);
            setValue('slots', data.slots);
            setValue('draft_weekly_plan_id', data.draft_weekly_plan_id);
        }
    }, [data]);

    const handleCloseModal = () => {
        setSearchParams(searchParams => {
            searchParams.delete('editTask');
            return searchParams;
        })
        reset()
    }

    if (data && plans) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Editar Guia de Tarea" >
            <div className="p-5">
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <InputComponent<DraftTaskPlantationControl>
                        label="Horas"
                        id="hours"
                        name="hours"
                        placeholder="Horas"
                        register={register}
                        validation={{ required: 'Las horas son requeridas' }}
                        errors={errors}
                        type={'text'}
                    >
                        {errors.hours && <Error>{errors.hours?.message?.toString()}</Error>}
                    </InputComponent>

                    <InputComponent<DraftTaskPlantationControl>
                        label="Presupuesto"
                        id="budget"
                        name="budget"
                        placeholder="Presupuesto"
                        register={register}
                        validation={{ required: 'El presupuesto es requerido' }}
                        errors={errors}
                        type={'text'}
                    >
                        {errors.budget && <Error>{errors.budget?.message?.toString()}</Error>}
                    </InputComponent>

                    <InputComponent<DraftTaskPlantationControl>
                        label="Etiquetas"
                        id="tags"
                        name="tags"
                        placeholder="Etiquetas separadas por coma. Ej: atrasada, adelantada, nueva"
                        register={register}
                        validation={{}}
                        errors={errors}
                        type={'text'}
                    >
                        {errors.tags && <Error>{errors.tags?.message?.toString()}</Error>}
                    </InputComponent>

                    <InputSelectSearchComponent<DraftTaskPlantationControl>
                        label="Plan Semanal"
                        id="draft_weekly_plan_id"
                        name="draft_weekly_plan_id"
                        options={plansOptions ?? []}
                        control={control}
                        rules={{ required: 'El plan semanal es requerido' }}
                        errors={errors}
                    >
                        {errors.draft_weekly_plan_id && <Error>{errors.draft_weekly_plan_id?.message?.toString()}</Error>}
                    </InputSelectSearchComponent>

                    <button type="submit" className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </Modal >

    );
}
