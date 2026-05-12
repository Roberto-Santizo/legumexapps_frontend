import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createDraftWeeklyProductionPlan } from "@/api/DraftWeeklyProductionPlanAPI";
import Modal from "../Modal";
import InputComponent from "../form/InputComponent";
import Error from "../utilities-components/Error";
import Spinner from "../utilities-components/Spinner";
import { useNotification } from "../../core/notifications/NotificationContext";

export type DraftWeeklyProductionPlan = {
    week: number;
    year: number;
}


export default function ModalCreateDraftPlanProduction() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('newDraftPlanification')!;
    const show = modal ? true : false;

    const navigate = useNavigate();
    const notify = useNotification();

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<DraftWeeklyProductionPlan>();


    const { mutate, isPending } = useMutation({
        mutationFn: createDraftWeeklyProductionPlan,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (data) => {
            handleCloseModal();
            navigate(`/planificador-produccion/${data}`, { replace: true });
        }
    });

    const handleCloseModal = () => {
        navigate(location.pathname, { replace: true });
    }

    const onSubmit = (data: DraftWeeklyProductionPlan) => {
        mutate(data);
    }

    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Crear Draft Planificación de Producción">
            <div className="flex items-center justify-center p-10">
                <form className="w-full space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <InputComponent<DraftWeeklyProductionPlan>
                        label="Número de semana"
                        id="week"
                        name="week"
                        placeholder="Número de semana"
                        register={register}
                        validation={{ required: 'La semana del plan es requerido', min: { value: 1, message: 'El valor minimo es 1' }, max: { value: 52, message: 'El valor maximo es 52' } }}
                        errors={errors}
                        type={'number'}
                    >
                        {errors.week && <Error>{errors.week?.message?.toString()}</Error>}
                    </InputComponent>

                    <InputComponent<DraftWeeklyProductionPlan>
                        label="Año"
                        id="year"
                        name="year"
                        placeholder="Año del plan semanal"
                        register={register}
                        validation={{
                            required: 'El año del plan es requerido',
                            min: {
                                value: 2000,
                                message: 'El año no puede ser menor a 2000'
                            },
                            max: {
                                value: new Date().getFullYear() + 1,
                                message: 'El año no es válido'
                            },
                            validate: (value: number) =>
                                /^\d{4}$/.test(value.toString()) || 'Debe ser un año válido de 4 dígitos'
                        }}
                        errors={errors}
                        type="number"
                    >
                        {errors.year && <Error>{errors.year?.message?.toString()}</Error>}
                    </InputComponent>


                    <button disabled={isPending} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                        {isPending ? <Spinner /> : <p>Crear Draft Plan Producción</p>}
                    </button>
                </form>
            </div>
        </Modal>
    )
}
