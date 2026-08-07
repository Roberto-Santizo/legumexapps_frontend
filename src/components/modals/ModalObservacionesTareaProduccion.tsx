import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEditDetailsProductionTask, updateTaskProductionObservations } from "@/api/TaskProductionPlansAPI";
import { usePermissions } from "@/hooks/usePermissions";
import { useAppStore } from "@/store";
import Modal from "../Modal";
import Error from "../utilities-components/Error";
import Spinner from "../utilities-components/Spinner";
import { useNotification } from "../../core/notifications/NotificationContext";

export type DraftTaskProductionObservations = {
    observations: string;
}

export default function ModalObservacionesTareaProduccion() {
    const params = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const plan_id = params.plan_id!;
    const date = queryParams.get('date') ?? '';
    const taskId = queryParams.get('observationsTask')!;
    const show = taskId ? true : false;

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const notify = useNotification();
    const { hasPermission } = usePermissions();

    const filters = useAppStore((state) => state.filtersWithOperationDate);

    const { data } = useQuery({
        queryKey: ['getEditDetailsProductionTask', taskId],
        queryFn: () => getEditDetailsProductionTask({ taskId }),
        enabled: !!taskId
    });

    const isEditing = !!data?.observations;
    const canSubmit = isEditing ? hasPermission('edit production task') : hasPermission('create production task observation');

    const handleCloseModal = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete("observationsTask");
        navigate(`${location.pathname}?${searchParams.toString()}`);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: updateTaskProductionObservations,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (data) => {
            notify.success(data ?? '');
            queryClient.invalidateQueries({ queryKey: ['getEditDetailsProductionTask', taskId] });
            queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', plan_id, date, filters] });
            queryClient.invalidateQueries({ queryKey: ['getTaskProductionDetails', taskId] });
            handleCloseModal();
        }
    });

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors }
    } = useForm<DraftTaskProductionObservations>();

    useEffect(() => {
        if (data) {
            setValue('observations', data.observations);
        }
    }, [data]);

    const onSubmit = (FormData: DraftTaskProductionObservations) => {
        mutate({ taskId, formData: FormData });
    }

    if (data) return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title={isEditing ? 'Editar Observación' : 'Agregar Observación'}>
            <form className="p-10 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="observations" className="text-lg font-bold uppercase">Observación</label>
                    <textarea
                        id="observations"
                        rows={4}
                        disabled={!canSubmit}
                        className="w-full mt-2 p-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                        placeholder="Describe la observación de la tarea"
                        {...register("observations", { maxLength: { value: 255, message: 'La observación no puede exceder los 255 caracteres' } })}
                    />
                    {errors.observations && <Error>{errors.observations?.message?.toString()}</Error>}
                </div>

                {canSubmit ? (
                    <button disabled={isPending} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                        {isPending ? <Spinner /> : <p>Guardar Observación</p>}
                    </button>
                ) : (
                    <p className="text-center text-gray-500">No tiene permisos para modificar la observación</p>
                )}
            </form>
        </Modal>
    )
}
