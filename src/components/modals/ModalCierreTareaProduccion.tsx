// import { closeTaskProduction, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { closeTaskProduction } from "@/api/TaskProductionPlansAPI";
import Modal from "../Modal";
import InputComponent from "../form/InputComponent";
import Error from "../utilities-components/Error";
import Spinner from "../utilities-components/Spinner";


export type DraftCloseTask = {
    total_tarimas: number;
    total_lbs_bascula: number;
    total_boxes_produced: number;
}

export default function ModalCierreTareaProduccion() {
    const queryClient = useQueryClient();
    const params = useParams();
    const plan_id = params.plan_id!!;
    const linea_id = params.linea_id!!;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('TaskId')!;
    const modal = queryParams.get('modal')!;
    const show = (taskId && +modal === 1) ? true : false;
    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm<DraftCloseTask>();


    const { mutate, isPending } = useMutation({
        mutationFn: closeTaskProduction,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['getTasksByLineId', plan_id, linea_id] });
            navigate(location.pathname, { replace: true });
            reset();
        }
    });


    const onSubmit = (data: DraftCloseTask) => mutate({ id: taskId, FormData: data });

    return (
        <Modal modal={show} closeModal={() => navigate(location.pathname, { replace: true })} title="Cierre de Tarea">
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
                    validation={{
                        required: 'El total de libras producidas es obligatoria',
                        min: {
                            value: 0,
                            message: "El valor debe de ser mayor a 0"
                        },
                        pattern: {
                            value: /^-?\d+$/,
                            message: "Debe ser un número entero"
                        }
                    }}
                    errors={errors}
                    type={'number'}
                >
                    {errors.total_lbs_bascula && <Error>{errors.total_lbs_bascula?.message?.toString()}</Error>}
                </InputComponent>

                <InputComponent<DraftCloseTask>
                    label="Total de cajas producidas"
                    id="total_boxes_produced"
                    name="total_boxes_produced"
                    placeholder="Total de cajas producidas"
                    register={register}
                    validation={{
                        required: 'El total de cajas producidas es obligatorio',
                        min: {
                            value: 0,
                            message: "El valor debe de ser mayor a 0"
                        },
                        pattern: {
                            value: /^-?\d+$/,
                            message: "Debe ser un número entero"
                        }
                    }}
                    errors={errors}
                    type={'number'}
                >
                    {errors.total_boxes_produced && <Error>{errors.total_boxes_produced?.message?.toString()}</Error>}
                </InputComponent>

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                    {isPending ? <Spinner /> : <p>Cerrar Tarea</p>}
                </button>
            </form>
        </Modal>

    );
}
