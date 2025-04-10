import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TaskCrop, WeeklyPlan } from "@/types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAllPlans } from "@/api/WeeklyPlansAPI";
import { getAllLotes, Lote } from "@/api/LotesAPI";
import { getAllTasksCrop } from "@/api/TasksCropAPI";
import { useQueries, useMutation } from "@tanstack/react-query";
import { createTaskCropWeeklyPlan } from "@/api/TaskCropWeeklyPlanAPI";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";

export type DraftTaskCropWeeklyPlan = {
  weekly_plan_id: string;
  lote_id: string;
  task_crop_id: string;
}
export default function CreateTareaLoteCosecha() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [plans, setPlans] = useState<WeeklyPlan[]>([]);
  const [tasksCrop, setTasksCrop] = useState<TaskCrop[]>([]);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createTaskCropWeeklyPlan,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate("/planes-semanales");
    }
  });
  const results = useQueries({
    queries: [
      { queryKey: ['getAllTasksCrop'], queryFn: getAllTasksCrop },
      { queryKey: ['getAllPlans'], queryFn: getAllPlans },
      { queryKey: ['getAllLotes'], queryFn: getAllLotes }
    ]
  });

  useEffect(() => {
    if (results[0].data) setTasksCrop(results[0].data);
    if (results[1].data) setPlans(results[1].data);
    if (results[2].data) setLotes(results[2].data);
  }, [results]);

  const plansOptions = plans.map((plan) => ({
    value: plan.id,
    label: `${plan.finca} - ${plan.week}`,
  }));

  const lotesOptions = lotes.map((lote) => ({
    value: lote.id,
    label: lote.name,
  }));

  const tasksCropOptions = tasksCrop.map((task) => ({
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
      className="w-1/2 mx-auto space-y-5"
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
        options={tasksCropOptions}
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
