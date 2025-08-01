import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createNewTaskProductionDraft } from "@/api/DraftTaskProductionDraftAPI";
import { useState } from "react";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import FormNewDraftTaskProduction from "@/views/produccion/planificador/FormNewDraftTaskProduction";

export type NewTaskProductionDraft = {
    draft_weekly_production_plan_id: string;
    line_id: string;
    stock_keeping_unit_id: string;
    total_lbs: number;
    destination: string;
}

export default function ModalAddNewDraftProductionTask() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const newTask = queryParams.get('newTask')!;
    const show = newTask ? true : false;
    const [skuId, setSkuId] = useState<string>('');

    const params = useParams<{ id: string }>();
    const id = params.id!;

    const navigate = useNavigate();

    const handleCloseModal = () => {
        navigate(location.pathname);
    }

    const {
        handleSubmit,
        formState: { errors },
        register,
        control,
        reset
    } = useForm<NewTaskProductionDraft>();

    const { mutate, isPending } = useMutation({
        mutationFn: createNewTaskProductionDraft,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            setSkuId('');
            reset();
            handleCloseModal();
        }
    });

    const onSubmit = (formData: NewTaskProductionDraft) => {
        mutate({ formData, id });
    }
    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Creación de Draft Tarea Produccion">
            <form className="w-full mx-auto shadow p-10 space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>

                <FormNewDraftTaskProduction register={register} errors={errors} control={control} skuId={skuId} setSkuId={setSkuId} />

                <button disabled={isPending} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                    {isPending ? <Spinner /> : <p>Crear Tarea Producción</p>}
                </button>
            </form>
        </Modal>
    )
}
