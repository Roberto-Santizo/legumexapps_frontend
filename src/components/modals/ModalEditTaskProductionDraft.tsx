import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { editTaskProductionDraft, getTaskProductionDraftEditDetails } from "@/api/DraftTaskProductionDraftAPI";
import { useForm } from "react-hook-form";
import { NewTaskProductionDraft } from "./ModalAddNewDraftProductionTask";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "../Modal";
import FormNewDraftTaskProduction from "@/views/produccion/production-planner/FormNewDraftTaskProduction";
import Spinner from "../utilities-components/Spinner";

export default function ModalEditTaskProductionDraft() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('editDraftTask')!;
    const show = taskId ? true : false;
    const [skuId, setSkuId] = useState<string>('');

    const navigate = useNavigate();

    const handleCloseModal = () => {
        navigate(location.pathname, { replace: true });
    }

    const { data } = useQuery({
        queryKey: ['getTaskProductionDraftEditDetails', taskId],
        queryFn: () => getTaskProductionDraftEditDetails({ id: taskId }),
        enabled: !!taskId
    });

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
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            handleCloseModal();
        }
    });

    useEffect(() => {
        if (data) {
            setSkuId(data.stock_keeping_unit_id.toString());
            setValue('stock_keeping_unit_id', data.stock_keeping_unit_id.toString());
            setValue('total_lbs', data.total_lbs);
            setValue('destination', data.destination);
        }
    }, [data]);


    const onSubmit = (formData: NewTaskProductionDraft) => {
        mutate({ formData, id: taskId });
    }

    if (data) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Editar Tarea Producción">
            <form className="w-full mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
                <FormNewDraftTaskProduction register={register} errors={errors} control={control} skuId={skuId} setSkuId={setSkuId} />

                <button disabled={isPending} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                    {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
                </button>
            </form>
        </Modal>
    )
}
