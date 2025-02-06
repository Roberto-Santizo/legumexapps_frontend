import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import {
  DraftTaskCropWeeklyPlan,
  Lote,
  TaskCrop,
  WeeklyPlan,
} from "../../../types";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Error from "../../../components/Error";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CreateTareaLoteCosecha() {
  const [loading, setLoading] = useState<boolean>(false);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [plans, setPlans] = useState<WeeklyPlan[]>([]);
  const [tasksCrop, setTasksCrop] = useState<TaskCrop[]>([]);
  const navigate = useNavigate();
  const createTaskCropWeeklyPlan = useAppStore(
    (state) => state.createTaskCropWeeklyPlan
  );
  const getAllTasksCrop = useAppStore((state) => state.getAllTasksCrop);
  const getAllPlans = useAppStore((state) => state.getAllPlans);
  const fetchAllLotes = useAppStore((state) => state.fetchAllLotes);

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

  const handleGetInfo = async () => {
    setLoading(true);
    try {
      const tasksCrop = await getAllTasksCrop();
      const plans = await getAllPlans();
      const lotes = await fetchAllLotes();
      setLotes(lotes);
      setTasksCrop(tasksCrop);
      setPlans(plans);
    } catch (error) {
      toast.error("Error al traer la información");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetInfo();
  }, []);

  const CreateTareaLoteCosecha = async (data: DraftTaskCropWeeklyPlan) => {
    setLoading(true);
    try {
      await createTaskCropWeeklyPlan(data);
      toast.success("Actividad creada correctamente");
      navigate("/planes-semanales");
    } catch (error) {
      toast.error("Hubo un error al crear la actividad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            TAREA COSEHCA:
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

        <Button
          disabled={loading}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {loading ? (
            <Spinner />
          ) : (
            <p className="font-bold text-lg">Crear Tarea de Cosecha</p>
          )}
        </Button>
      </form>
    </>
  );
}
