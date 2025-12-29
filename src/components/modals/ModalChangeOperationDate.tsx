import { useMutation } from "@tanstack/react-query";
import { getCurrentDate } from "@/helpers";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateTaskProductionOperationDate } from "@/api/TaskProductionPlansAPI";
import { useAppStore } from "@/store";
import { useForm } from "react-hook-form";
import Spinner from "@/components/utilities-components/Spinner";
import Modal from "../Modal";
import InputComponent from "../form/InputComponent";
import Error from "../utilities-components/Error";
import { useNotification } from "../../core/notifications/NotificationContext";


export type DraftChangeOperationDate = {
  date: string;
  reason: string;
}

export default function ModalChangeOperationDate() {
  const location = useLocation();
  const params = useParams();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date')!;
  const taskId = queryParams.get('changeOperationTask')!;
  const plan_id = params.plan_id!;
  const open = taskId ? true : false;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const notify = useNotification();

  const filters = useAppStore((state) => state.filtersWithOperationDate);

  const handleCloseModal = () => {
    queryParams.delete('changeOperationTask');
    navigate(`${location.pathname}?${queryParams.toString()}`);
  }

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<DraftChangeOperationDate>();

  const { mutate, isPending } = useMutation({
    mutationFn: updateTaskProductionOperationDate,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', plan_id, date, filters] });
      queryClient.invalidateQueries({ queryKey: ['getWeeklyProductionPlanEvents', plan_id] });
      handleCloseModal();
    }
  });

  const onSubmit = (FormData: DraftChangeOperationDate) => mutate({ id: taskId, FormData })

  return (
    <Modal modal={open} closeModal={() => handleCloseModal()} title="Cambio de Fecha Operación">
      <form className="w-full p-10 mx-auto space-y-5" onSubmit={handleSubmit(onSubmit)}>

        <InputComponent<DraftChangeOperationDate>
          label="Nueva Fecha de Operación"
          id="date"
          name="date"
          placeholder=""
          register={register}
          validation={{ required: 'La fecha de operación es obligatoria' }}
          errors={errors}
          type={'date'}
          min={getCurrentDate()}
        >
          {errors.date && <Error>{errors.date?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftChangeOperationDate>
          label="Razón"
          id="reason"
          name="reason"
          placeholder="Razón del cambio"
          register={register}
          validation={{ required: 'La razón es requerida' }}
          errors={errors}
          type={'text'}
        >
          {errors.reason && <Error>{errors.reason?.message?.toString()}</Error>}
        </InputComponent>

        <button type="submit" className="button w-full mt-5 bg-indigo-500 hover:bg-indigo-600">
          {isPending ? <Spinner /> : <p>Realizar Cambio</p>}
        </button>
      </form>
    </Modal>

  )
}
