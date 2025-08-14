import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createDraftWeeklyProductionPlan } from "@/api/DraftWeeklyProductionPlanAPI";
import { toast } from "react-toastify";
import Modal from "../Modal";
import InputComponent from "../form/InputComponent";
import Error from "../utilities-components/Error";
import Spinner from "../utilities-components/Spinner";

export type DraftWeeklyProductionPlan = {
    week: number;
}


export default function ModalCreateDraftPlanProduction() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('newDraftPlanification')!;
    const show = modal ? true : false;

    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<DraftWeeklyProductionPlan>();


    const { mutate, isPending } = useMutation({
        mutationFn: createDraftWeeklyProductionPlan,
        onError: (error) => {
            toast.error(error.message);
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
                        validation={{ required: 'La semana del plan es requerido' }}
                        errors={errors}
                        type={'number'}
                    >
                        {errors.week && <Error>{errors.week?.message?.toString()}</Error>}
                    </InputComponent>


                    <button disabled={isPending} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                        {isPending ? <Spinner /> : <p>Crear Draft Plan Producción</p>}
                    </button>
                </form>
            </div>
        </Modal>
    )
}
