import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DraftNewTaskProduction } from "./ModalCrearTareaProduccion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { editProductionTask, getEditDetailsProductionTask } from "@/api/TaskProductionPlansAPI";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppStore } from "@/store";
import { getSkus } from "@/api/SkusAPI";
import { FiltersSkuInitialValues } from "@/views/produccion/stock-keeping-units/Index";
import { getLinesBySkuId } from "@/api/LinesAPI";
import FormProductionTask from "@/views/produccion/production-tasks/Form";
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


    const { data: skus } = useQuery({
        queryKey: ['getSkus'],
        queryFn: () => getSkus({ page: 1, paginated: '', filters: FiltersSkuInitialValues })
    });

    const { data: lineas } = useQuery({
        queryKey: ['getLinesBySkuId', data?.sku_id],
        queryFn: () => getLinesBySkuId(data?.sku_id!),
        enabled: !!data?.sku_id
    });

    const skuOptions = skus?.data?.map((sku) => ({
        value: sku.id,
        label: `${sku.code} - ${sku.product_name}`,
    }));

    const handleCloseModal = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete("editTask");
        navigate(`${location.pathname}?${searchParams.toString()}`);
    }

    const { mutate, isPending } = useMutation({
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
    } = useForm<DraftNewTaskProduction>();

    useEffect(() => {
        if (data && data.sku_id) {
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

                <FormProductionTask register={register} errors={errors} control={control} skus={skuOptions ?? []} lines={lineas ?? []} disabled={true} />

                <button disabled={isPending} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                    {isPending ? <Spinner /> : <p>Editar Tarea</p>}
                </button>
            </form>
        </Modal>
    )
}
