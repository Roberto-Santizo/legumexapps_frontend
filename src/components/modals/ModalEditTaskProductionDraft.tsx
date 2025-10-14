import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { editTaskProductionDraft, getTaskProductionDraftEditDetails } from "@/api/DraftTaskProductionDraftAPI";
import { useForm } from "react-hook-form";
import { NewTaskProductionDraft } from "./ModalAddNewDraftProductionTask";
import { useEffect } from "react";
import { getSkus } from "@/api/SkusAPI";
import { getLinesBySkuId } from "@/api/LinesAPI";
import { FiltersSkuInitialValues } from "@/views/produccion/stock-keeping-units/Index";
import Modal from "../Modal";
import FormNewDraftTaskProduction from "@/views/produccion/production-planner/FormNewDraftTaskProduction";
import Spinner from "../utilities-components/Spinner";
import { useNotification } from "../../core/notifications/NotificationContext";

export default function ModalEditTaskProductionDraft() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('editDraftTask')!;
    const show = taskId ? true : false;

    const navigate = useNavigate();
    const notify = useNotification();

    const handleCloseModal = () => {
        navigate(location.pathname, { replace: true });
    }

    const { data } = useQuery({
        queryKey: ['getTaskProductionDraftEditDetails', taskId],
        queryFn: () => getTaskProductionDraftEditDetails({ id: taskId }),
        enabled: !!taskId
    });


    const { data: skus } = useQuery({
        queryKey: ['getSkus'],
        queryFn: () => getSkus({ page: 1, paginated: '', filters: FiltersSkuInitialValues })
    });

    const { data: lineas } = useQuery({
        queryKey: ['getLinesBySkuId', data?.stock_keeping_unit_id],
        queryFn: () => getLinesBySkuId(data?.stock_keeping_unit_id.toString()!),
        enabled: !!data?.stock_keeping_unit_id
    });

    const skuOptions = skus?.data?.map((sku) => ({
        value: sku.id,
        label: `${sku.code} - ${sku.product_name}`,
    }));

    const {
        register,
        formState: { errors },
        control,
        setValue,
        handleSubmit
    } = useForm<NewTaskProductionDraft>();

    const { mutate, isPending } = useMutation({
        mutationFn: editTaskProductionDraft,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (data) => {
            notify.success(data);
            handleCloseModal();
        }
    });

    useEffect(() => {
        if (data && data.stock_keeping_unit_id) {
            setValue('stock_keeping_unit_id', data.stock_keeping_unit_id.toString());
            setValue('total_lbs', data.total_lbs);
            setValue('destination', data.destination);
            setValue('line_id', data.line_id?.toString() ?? '');
        }
    }, [data]);


    const onSubmit = (formData: NewTaskProductionDraft) => {
        mutate({ formData, id: taskId });
    }

    if (data) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Editar Tarea Producción">
            <form className="w-full mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
                <FormNewDraftTaskProduction register={register} errors={errors} control={control} skus={skuOptions ?? []} lines={lineas ?? []} disabled={true}/>

                <button disabled={isPending} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                    {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
                </button>
            </form>
        </Modal>
    )
}
