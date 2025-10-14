import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createTaskProductionNote } from "@/api/TaskProductionPlansAPI";
import Error from "@/components/utilities-components/Error";
import Modal from "../Modal";
import Spinner from "../utilities-components/Spinner";
import { useNotification } from "../../core/notifications/NotificationContext";

export type DraftNote = {
    reason: string;
    action: string;
}

export default function ModalNotasProblemas() {
    const queryClient = useQueryClient();
    const params = useParams();
    const plan_id = params.plan_id!;
    const linea_id = params.linea_id!;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('TaskId')!;
    const modal = queryParams.get('modal')!;
    const show = (taskId && +modal === 4) ? true : false;
    const navigate = useNavigate();
    const notify = useNotification();


    const { mutate, isPending } = useMutation({
        mutationFn: createTaskProductionNote,
        onError: (error) => {
            notify.error(error.message);
        },
        onSuccess: (data) => {
            notify.success(data ?? '');
            queryClient.invalidateQueries({ queryKey: ['getTasksByLineId', plan_id, linea_id] });
            navigate(location.pathname, { replace: true });
        }
    });

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<DraftNote>();

    const onSubmit = (FormData: DraftNote) => {
        const data = {
            reason: FormData.reason,
            action: FormData.action,
            task_p_id: taskId
        }
        mutate(data);
    }
    return (
        <Modal modal={show} closeModal={() => navigate(location.pathname, { replace: true })} title="Agregar Nota">
            <form className="p-6 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="reason" className="text-lg font-bold uppercase">Problema</label>
                    <textarea
                        id="reason"
                        className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                        placeholder="Describe el problema"
                        {...register("reason", { required: 'La descripción del problema es requerido', maxLength: { value: 255, message: 'El valor maximo del reporte es de 255 caracteres' } })}
                    />
                    {errors.reason?.message && <Error>{errors.reason?.message}</Error>}
                </div>

                <div className="mb-4">
                    <label htmlFor="action" className="text-lg font-bold uppercase">Acción Tomada</label>
                    <textarea
                        id="action"
                        className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                        placeholder="Describe la acción tomada"
                        {...register("action", { required: 'La descripción de la acción es requerida', maxLength: { value: 255, message: 'El valor maximo del reporte es de 255 caracteres' } })}
                    />
                    {errors.action?.message && <Error>{errors.action?.message}</Error>}
                </div>

                <button disabled={isPending} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                    {isPending ? <Spinner /> : <p>Registrar Nota</p>}
                </button>
            </form>
        </Modal>

    )
}
