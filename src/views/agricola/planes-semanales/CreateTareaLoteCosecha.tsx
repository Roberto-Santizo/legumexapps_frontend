import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TaskCrop, WeeklyPlan } from "@/types";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAllPlans } from "@/api/WeeklyPlansAPI";
import { getAllLotes, Lote } from "@/api/LotesAPI";
import { getAllTasksCrop } from "@/api/TasksCropAPI";
import { useQueries, useMutation } from "@tanstack/react-query";
import { createTaskCropWeeklyPlan } from "@/api/TaskCropWeeklyPlanAPI";
import Spinner from "@/components/utilities-components/Spinner";
import Select from "react-select";
import Error from "@/components/utilities-components/Error";

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
    register,
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
      <div className="flex flex-col gap-2">
        <label
          className="text-lg font-bold uppercase"
          htmlFor="weekly_plan_id"
        >
          PLAN SEMANAL:
        </label>
        <Controller
          name="weekly_plan_id"
          control={control}
          rules={{ required: "Seleccione un plan semanal" }}
          render={({ field }) => (
            <Select
              {...field}
              options={plansOptions}
              id="weekly_plan_id"
              placeholder={"--SELECCIONE UNA OPCION--"}
              {...register("weekly_plan_id", {
                required: "Especifique el plan semanal",
              })}
              onChange={(selected) => field.onChange(selected?.value)}
              value={plansOptions.find(
                (option) => option.value === field.value
              )}
            />
          )}
        />
        {errors.weekly_plan_id && (
          <Error>{errors.weekly_plan_id?.message?.toString()}</Error>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-lg font-bold uppercase" htmlFor="lote_id">
          Lote:
        </label>
        <Controller
          name="lote_id"
          control={control}
          rules={{ required: "Seleccione un Lote" }}
          render={({ field }) => (
            <Select
              {...field}
              options={lotesOptions}
              id="lote_id"
              placeholder={"--SELECCIONE UNA OPCION--"}
              {...register("lote_id", {
                required: "Especifique el lote",
              })}
              onChange={(selected) => field.onChange(selected?.value)}
              value={lotesOptions.find(
                (option) => option.value === field.value
              )}
            />
          )}
        />
        {errors.lote_id && (
          <Error>{errors.lote_id?.message?.toString()}</Error>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-lg font-bold uppercase" htmlFor="task_crop_id">
          TAREA COSECHA:
        </label>
        <Controller
          name="task_crop_id"
          control={control}
          rules={{ required: "Seleccione un Lote" }}
          render={({ field }) => (
            <Select
              {...field}
              options={tasksCropOptions}
              id="task_crop_id"
              placeholder={"--SELECCIONE UNA OPCION--"}
              {...register("task_crop_id", {
                required: "Especifique la tarea",
              })}
              onChange={(selected) => field.onChange(selected?.value)}
              value={tasksCropOptions.find(
                (option) => option.value === field.value
              )}
            />
          )}
        />
        {errors.task_crop_id && (
          <Error>{errors.task_crop_id?.message?.toString()}</Error>
        )}
      </div>

      <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
        {isPending ? <Spinner /> : <p>Crear Tarea de Cosecha</p>}
      </button>
    </form>
  );
}
