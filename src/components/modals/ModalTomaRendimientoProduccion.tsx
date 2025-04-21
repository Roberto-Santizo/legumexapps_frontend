import { createTaskProductionPerformance, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import InputComponent from "../form/InputComponent";
import Error from "../utilities-components/Error";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export type DraftPerformance = {
    tarimas_produced: number;
    lbs_bascula: number;
}

export default function ModalTomaRendimientoProduccion() {
    const queryClient = useQueryClient();
    const params = useParams();
    const plan_id = params.plan_id!!;
    const linea_id = params.linea_id!!;


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('TaskId')!;
    const modal = queryParams.get('modal')!;
    const show = (taskId && +modal === 2) ? true : false;
    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, data }: { id: TaskProduction['id'], data: DraftPerformance }) => createTaskProductionPerformance(id, data),
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['getTasksByLineId', plan_id, linea_id] });
            navigate(location.pathname,{replace:true});
        }
    })

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<DraftPerformance>();


    const onSubmit = (data: DraftPerformance) => mutate({ id: taskId, data });
    return (
        <Modal modal={show} closeModal={() => navigate(location.pathname, { replace: true })} title="Toma de Rendimiento">
            <form className="p-6 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                <InputComponent<DraftPerformance>
                    label="Tarimas Producidas"
                    id="tarimas_produced"
                    name="tarimas_produced"
                    placeholder="Total Tarimas Producidas"
                    register={register}
                    validation={{}}
                    errors={errors}
                    type={'number'}
                >
                    {errors.tarimas_produced && <Error>{errors.tarimas_produced?.message?.toString()}</Error>}
                </InputComponent>

                <InputComponent<DraftPerformance>
                    label="Libras Báscula"
                    id="lbs_bascula"
                    name="lbs_bascula"
                    placeholder="Total Libras Basculadas"
                    register={register}
                    validation={{ required: 'Las libras basculadas son obligatorias' }}
                    errors={errors}
                    type={'number'}
                >
                    {errors.lbs_bascula && <Error>{errors.lbs_bascula?.message?.toString()}</Error>}
                </InputComponent>

                <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
                    {isPending ? <Spinner /> : <p>Guardar Registro</p>}
                </button>
            </form>
        </Modal>
    );
}
