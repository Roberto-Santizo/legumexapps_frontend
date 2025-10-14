import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createTaskCropWeeklyPlan } from "@/api/TaskCropWeeklyPlanAPI";
import { getAllTasksCrops } from "@/api/TasksCropAPI";
import { WeeklyPlan } from "@/types/planificacionFincasType";
import { Lote } from "@/types/lotesType";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import { useNotification } from "../../../core/notifications/NotificationContext";

export type DraftTaskCropWeeklyPlan = {
  weekly_plan_id: string;
  lote_id: string;
  task_crop_id: string;
}

type Props = {
  plans: WeeklyPlan[];
  lotes: Lote[];
}


export default function CreateTareaLoteCosecha({ plans, lotes }: Props) {
  const navigate = useNavigate();
  const notify = useNotification();

  const { mutate, isPending } = useMutation({
    mutationFn: createTaskCropWeeklyPlan,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      navigate("/planes-semanales");
    }
  });

  const { data: tasksCrops } = useQuery({
    queryKey: ['getAllTasksCrops'],
    queryFn: getAllTasksCrops
  });

  const plansOptions = plans.map((plan) => ({
    value: plan.id,
    label: `${plan.finca} - ${plan.week}`,
  }));

  const lotesOptions = lotes.map((lote) => ({
    value: lote.id,
    label: lote.name,
  }));

  const tasksCropOptions = tasksCrops?.map((task) => ({
    value: task.id,
    label: `${task.code} - ${task.name}`,
  }));

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DraftTaskCropWeeklyPlan>();

  const CreateTareaLoteCosecha = async (data: DraftTaskCropWeeklyPlan) => mutate(data);

  return (
    <form
      className="w-2/3 mx-auto space-y-5 shadow-xl p-5"
      onSubmit={handleSubmit(CreateTareaLoteCosecha)}
    >
      <InputSelectSearchComponent<DraftTaskCropWeeklyPlan>
        label="Plan Semanal"
        id="weekly_plan_id"
        name="weekly_plan_id"
        options={plansOptions}
        control={control}
        rules={{ required: 'Seleccione un plan semanal' }}
        errors={errors}
      >
        {errors.weekly_plan_id && <Error>{errors.weekly_plan_id?.message?.toString()}</Error>}
      </InputSelectSearchComponent>

      <InputSelectSearchComponent<DraftTaskCropWeeklyPlan>
        label="Lote"
        id="lote_id"
        name="lote_id"
        options={lotesOptions}
        control={control}
        rules={{ required: 'Seleccione un lote' }}
        errors={errors}
      >
        {errors.lote_id && <Error>{errors.lote_id?.message?.toString()}</Error>}
      </InputSelectSearchComponent>

      <InputSelectSearchComponent<DraftTaskCropWeeklyPlan>
        label="Tarea de Cosecha"
        id="task_crop_id"
        name="task_crop_id"
        options={tasksCropOptions ? tasksCropOptions : []}
        control={control}
        rules={{ required: 'Seleccione una tarea de cosecha' }}
        errors={errors}
      >
        {errors.task_crop_id && <Error>{errors.task_crop_id?.message?.toString()}</Error>}
      </InputSelectSearchComponent>
      <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
        {isPending ? <Spinner /> : <p>Crear Tarea de Cosecha</p>}
      </button>
    </form>
  );
}
