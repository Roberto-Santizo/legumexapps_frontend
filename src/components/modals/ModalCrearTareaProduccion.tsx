import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createNewTaskProduction } from "@/api/TaskProductionPlansAPI";
import { useAppStore } from "@/store";
import { getSkus } from "@/api/SkusAPI";
import { getLinesBySkuId } from "@/api/LinesAPI";
import { FiltersSkuInitialValues } from "@/views/produccion/stock-keeping-units/Index";
import { useState } from "react";
import Spinner from "@/components/utilities-components/Spinner";
import Modal from "../Modal";
import FormProductionTask from "@/views/produccion/production-tasks/Form";

export type DraftNewTaskProduction = {
    sku_id: string,
    line_id: string,
    operation_date: string,
    total_lbs: number,
    destination: string;
}

export default function ModalCrearTareaProduccion() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const newTask = queryParams.get('newTask')!;
    const show = newTask ? true : false;
    const date = queryParams.get('date') ?? '';

    const params = useParams();
    const plan_id = params.plan_id!!;
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const filtersNoOperationDate = useAppStore((state) => state.filtersNoOperationDate);
    const filters = useAppStore((state) => state.filtersWithOperationDate);

    const [skuId, setSkuId] = useState<string>('');

    const handleCloseModal = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete("newTask");
        navigate(`${location.pathname}?${searchParams.toString()}`);
    }

    const { data: skus } = useQuery({
        queryKey: ['getSkus'],
        queryFn: () => getSkus({ page: 1, paginated: '', filters: FiltersSkuInitialValues })
    });

    const skuOptions = skus?.data?.map((sku) => ({
        value: sku.id,
        label: `${sku.code} - ${sku.product_name}`,
    }));

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
        reset
    } = useForm<DraftNewTaskProduction>();

    const { data: lineas } = useQuery({
        queryKey: ['getLinesBySkuId', skuId],
        queryFn: () => getLinesBySkuId(skuId),
        enabled: !!skuId
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createNewTaskProduction,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', plan_id, date, filters] });
            queryClient.invalidateQueries({ queryKey: ['getWeeklyProductionPlanEvents', plan_id] });
            queryClient.invalidateQueries({ queryKey: ['getLineHoursPerWeek', plan_id] });
            queryClient.invalidateQueries({ queryKey: ['getTasksNoOperationDate', plan_id, filtersNoOperationDate], });
            handleCloseModal();
            reset();
        }
    });

    const onSubmit = (data: DraftNewTaskProduction) => {
        mutate({ FormData: data, id: plan_id });
    };

    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Creación de Tarea Produccion Extraordinaria">
            <form className="w-full mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>

                <FormProductionTask register={register} errors={errors} control={control} skus={skuOptions ?? []} lines={lineas ?? []} setSkuId={setSkuId} />

                <button className="button w-full bg-indigo-500 hover:bg-indigo-600">
                    {isPending ? <Spinner /> : <p>Crear Tarea Producción</p>}
                </button>
            </form>
        </Modal>
    )
}
