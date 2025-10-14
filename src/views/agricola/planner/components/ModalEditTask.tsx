import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTaskWeeklyPlanDraftById, UpdateTaskWeeklyPlanDraft } from "@/api/PlannerFincasAPI";
import { useForm } from "react-hook-form";
import { DraftTaskPlantationControl } from "@/types/index";
import { useEffect } from "react";
import { useNotification } from "../../../../core/notifications/NotificationContext";
import Modal from "@/components/Modal";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";

export default function ModalEditTask() {
    const location = useLocation();
    const navigate = useNavigate();
    const notify = useNotification();

    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('editTask')!;
    const show = taskId ? true : false;

    const { data } = useQuery({
        queryKey: ['getTaskWeeklyPlanDraftById', taskId],
        queryFn: () => getTaskWeeklyPlanDraftById(parseInt(taskId)),
        enabled: !!taskId
    });

    const { mutate } = useMutation({
        mutationFn: UpdateTaskWeeklyPlanDraft,
        onSuccess: () => {
            notify.success('En efecto sirvió', { position: "top-right" });
        },
        onError: () => {

        }
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue
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

    if (data) return (
        <Modal modal={show} closeModal={() => navigate(location.pathname, { replace: true })} title="Editar Guia de Tarea">
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
                        placeholder="Etiquetas"
                        register={register}
                        validation={{}}
                        errors={errors}
                        type={'text'}
                    >
                        {errors.tags && <Error>{errors.tags?.message?.toString()}</Error>}
                    </InputComponent>


                    <button type="submit" className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </Modal>

    );
}
