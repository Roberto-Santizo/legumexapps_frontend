import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DraftNewTaskProduction } from "./ModalCrearTareaProduccion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { editProductionTask, getEditDetailsProductionTask, updateTaskProductionObservations } from "@/api/TaskProductionPlansAPI";
import { useEffect, useMemo } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { useAppStore } from "@/store";
import { getSkus } from "@/api/SkusAPI";
import { FiltersSkuInitialValues } from "@/views/produccion/stock-keeping-units/Index";
import { getLinesBySkuId } from "@/api/LinesAPI";
import FormProductionTask from "@/views/produccion/production-tasks/Form";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import { useNotification } from "../../core/notifications/NotificationContext";

export default function ModalEditTareaProduccion() {
    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date') ?? '';
    const plan_id = params.plan_id!;
    const taskId = queryParams.get('editTask')!;
    const show = taskId ? true : false;

    const queryClient = useQueryClient();

    const filters = useAppStore((state) => state.filtersWithOperationDate);
    const filtersNoOperationDate = useAppStore((state) => state.filtersNoOperationDate);

    const navigate = useNavigate();
    const notify = useNotification();

    const { data } = useQuery({
        queryKey: ['getEditDetailsProductionTask', taskId],
        queryFn: () => getEditDetailsProductionTask({ taskId }),
        enabled: !!taskId
    });


    const { hasPermission } = usePermissions();

    const canEditObservations = data?.observations ? hasPermission('edit production task') : hasPermission('create production task observation');

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

    const { mutateAsync: editTask, isPending } = useMutation({
        mutationFn: editProductionTask
    });

    const { mutateAsync: editObservations, isPending: isPendingObservations } = useMutation({
        mutationFn: updateTaskProductionObservations
    });

    const loading = useMemo(() => isPending || isPendingObservations, [isPending, isPendingObservations]);

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
            setValue('observations', data.observations);
        }

    }, [data]);


    const onSubmit = async (formData: DraftNewTaskProduction) => {
        try {
            const message = await editTask({ taskId, formData });

            if (canEditObservations && (formData.observations ?? '') !== (data?.observations ?? '')) {
                await editObservations({ taskId, formData: { observations: formData.observations ?? '' } });
            }

            notify.success(message);
            queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', plan_id, date, filters] });
            queryClient.invalidateQueries({ queryKey: ['getTasksNoOperationDate', plan_id, filtersNoOperationDate] });
            queryClient.invalidateQueries({ queryKey: ['getLineHoursPerWeek', plan_id] });
            queryClient.invalidateQueries({ queryKey: ['getEditDetailsProductionTask', taskId] });

            handleCloseModal();
        } catch (error) {
            notify.error(error instanceof Error ? error.message : 'Error no controlado');
        }
    }

    if (data) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Creación de Tarea Produccion Extraordinaria">
            <form className="w-full mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>

                <FormProductionTask register={register} errors={errors} control={control} skus={skuOptions ?? []} lines={lineas ?? []} disabled={true} showObservations={canEditObservations} />

                <button disabled={loading} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                    {loading ? <Spinner /> : <p>Editar Tarea</p>}
                </button>
            </form>
        </Modal>
    )
}
