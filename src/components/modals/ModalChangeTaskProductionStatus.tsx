import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { statuses } from "../produccion/TasksWithOperationDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskProductionStatus } from "@/api/TaskProductionPlansAPI";
import { toast } from "react-toastify";
import { useAppStore } from "@/store";
import Modal from "../Modal";
import Error from "../utilities-components/Error";
import InputSelectComponent from "../form/InputSelectComponent";
import Spinner from "../utilities-components/Spinner";


export default function ModalChangeTaskProductionStatus() {
    const queryClient = useQueryClient();
    const location = useLocation();
    const params = useParams();

    const plan_id = params.plan_id!!;
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date') ?? '';
    const taskId = queryParams.get('changeStatus')!;
    const show = (taskId) ? true : false;
    const filters = useAppStore((state) => state.filtersWithOperationDate);
    const navigate = useNavigate();

    const handleCloseModal = () => {
        queryParams.delete('changeStatus');
        navigate(`${location.pathname}?${queryParams.toString()}`);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: updateTaskProductionStatus,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', plan_id, date, filters] });
            handleCloseModal();
        }
    });

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<{ status: number }>();

    const onSubmit = (data: { status: number }) => {
        mutate({ taskId: taskId, status: data.status });
    }

    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Cambiar Estado Tarea Producción">
            <form className="p-10 space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                <InputSelectComponent<{ status: number }>
                    label="Estado"
                    id="status"
                    name="status"
                    options={statuses}
                    register={register}
                    validation={{ required: 'El estado es requerido' }}
                    errors={errors}
                >
                    {errors.status && <Error>{errors.status?.message?.toString()}</Error>}
                </InputSelectComponent>


                <button disabled={isPending} className="button w-full bg-indigo-500 hover:bg-indigo-600">
                    {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
                </button>
            </form>
        </Modal>

    );
}
