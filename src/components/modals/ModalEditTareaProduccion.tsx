import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DraftNewTaskProduction } from "./ModalCrearTareaProduccion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { editProductionTask, getEditDetailsProductionTask } from "@/api/TaskProductionPlansAPI";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppStore } from "@/store";
import FormProductionTask from "@/views/produccion/tareas_produccion/FormProductionTask";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";

export default function ModalEditTareaProduccion() {
    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date') ?? '';
    const plan_id = params.plan_id!!;
    const taskId = queryParams.get('editTask')!;
    const show = taskId ? true : false;

    const queryClient = useQueryClient();

    const filters = useAppStore((state) => state.filtersWithOperationDate);
    const filtersNoOperationDate = useAppStore((state) => state.filtersNoOperationDate);

    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ['getEditDetailsProductionTask', taskId],
        queryFn: () => getEditDetailsProductionTask({ taskId }),
        enabled: !!taskId
    });

    const handleCloseModal = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete("editTask");
        navigate(`${location.pathname}?${searchParams.toString()}`);
    }

    const { mutate, isPending} = useMutation({
        mutationFn: editProductionTask,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', plan_id, date, filters] });
            queryClient.invalidateQueries({ queryKey: ['getTasksNoOperationDate', plan_id, filtersNoOperationDate] });
            queryClient.invalidateQueries({ queryKey: ['getLineHoursPerWeek', plan_id] });

            handleCloseModal();
        }
    });

    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors },
        getValues,
    } = useForm<DraftNewTaskProduction>();

    useEffect(() => {
        if (data) {
            setValue('destination', data.destination);
            setValue('line_id', data.line_id);
            setValue('sku_id', data.sku_id);
            setValue('total_lbs', data.total_lbs);
            setValue('operation_date', data.operation_date);
        }
    }, [data]);

    const onSubmit = (data: DraftNewTaskProduction) => {
        mutate({ taskId, formData: data });
    }

    if (data) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Creación de Tarea Produccion Extraordinaria">
            <form className="w-full mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>

                <FormProductionTask register={register} errors={errors} control={control} getValues={getValues} />

                <button disabled={isPending} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                    {isPending ? <Spinner /> : <p>Editar Tarea</p>}
                </button>
            </form>
        </Modal>
    )
}
