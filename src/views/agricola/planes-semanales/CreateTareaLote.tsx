import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import {
  DraftCreateTaskWeeklyPlan,
  Lote,
  Tarea,
  WeeklyPlan,
} from "../../../types";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Error from "../../../components/Error";
import { Button } from "@mui/material";
import Spinner from "../../../components/Spinner";
import { useNavigate } from "react-router-dom";

export default function CreateTareaLote() {
  const [loading, setLoading] = useState<boolean>(true);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [plans, setPlans] = useState<WeeklyPlan[]>([]);
  const navigate = useNavigate();
  const fetchAllLotes = useAppStore((state) => state.fetchAllLotes);
  const getAllTareas = useAppStore((state) => state.getAllTareas);
  const getAllPlans = useAppStore((state) => state.getAllPlans);
  const createTaskWeeklyPlan = useAppStore(
    (state) => state.createTaskWeeklyPlan
  );

  const lotesOptions = lotes.map((lote) => ({
    value: lote.id,
    label: lote.name,
  }));
  const tareasOptions = tareas.map((lote) => ({
    value: lote.id,
    label: `${lote.code} ${lote.name}`,
  }));
  const plansOptions = plans.map((plan) => ({
    value: plan.id,
    label: `${plan.finca} - ${plan.week}`,
  }));
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DraftCreateTaskWeeklyPlan>();

  const handleGetInfo = async () => {
    try {
      const lotes = await fetchAllLotes();
      const tareas = await getAllTareas();
      const plans = await getAllPlans();
      setLotes(lotes);
      setTareas(tareas);
      setPlans(plans);
    } catch (error) {
      toast.error("Hubo un error al traer la información");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetInfo();
  }, []);

  const CreateTareaLote = async (data: DraftCreateTaskWeeklyPlan) => {
    setLoading(true);
    try {
      await createTaskWeeklyPlan(data);
      navigate('/planes-semanales');
      toast.success("Tarea Creada Correctamente");
    } catch (error) {
      toast.error("Existe un error al guardar la tarea, verifique los datos");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="my-10 w-1/2 mx-auto">
        <form
          onSubmit={handleSubmit(CreateTareaLote)}
          className="space-y-5"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <label
              className="text-lg font-bold uppercase"
              htmlFor="workers_quantity"
            >
              Empleados Necesarios:
            </label>
            <input
              autoComplete="off"
              id="workers_quantity"
              type="number"
              placeholder={"Empleados necesarios de la tarea"}
              className="border border-black p-3"
              {...register("workers_quantity", {
                required: "El número de empleados es obligatorio",
                min: {
                  value: 1,
                  message: "El número de empleados debe de ser mayor a 0",
                },
              })}
            />
            {errors.workers_quantity && (
              <Error>{errors.workers_quantity?.message?.toString()}</Error>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-lg font-bold uppercase"
              htmlFor="hours"
            >
              Horas:
            </label>
            <input
              autoComplete="off"
              id="hours"
              type="number"
              placeholder={"Horas necesarias de la tarea"}
              className="border border-black p-3"
              {...register("hours", {
                required: "El número de horas es obligatorio",
                min: {
                  value: 1,
                  message: "El número de horas debe de ser mayor a 0",
                },
              })}
            />
            {errors.hours && (
              <Error>{errors.hours?.message?.toString()}</Error>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="budget">
              Presupuesto:
            </label>
            <input
              autoComplete="off"
              id="budget"
              type="number"
              placeholder={"Presupuesto de la tarea"}
              className="border border-black p-3"
              {...register("budget", {
                required: "El presupuesto es obligatorio",
                min: {
                  value: 1,
                  message: "El presupuesto debe de ser mayor a 0",
                },
              })}
            />
            {errors.budget && (
              <Error>{errors.budget?.message?.toString()}</Error>
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
            <label className="text-lg font-bold uppercase" htmlFor="tarea_id">
              TAREA:
            </label>
            <Controller
              name="tarea_id"
              control={control}
              rules={{ required: "Seleccione una Tarea" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={tareasOptions}
                  id="tarea_id"
                  placeholder={"--SELECCIONE UNA OPCION--"}
                  onChange={(selected) => field.onChange(selected?.value)}
                  value={tareasOptions.find(
                    (option) => option.value === field.value
                  )}
                />
              )}
            />
            {errors.tarea_id && (
              <Error>{errors.tarea_id?.message?.toString()}</Error>
            )}
          </div>

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
            <label
              className="text-lg font-bold uppercase"
              htmlFor="extraordinary"
            >
              Tipo de Tarea:
            </label>
            <select
              {...register("extraordinary", {
                required: "Especifique el tipo de la tarea",
              })}
              id="extraordinary"
              className="border p-1.5 border-gray-300 rounded"
            >
              <option value="">--SELECCIONE UNA OPCIÓN--</option>
              <option value="1">EXTRAORDINARIA</option>
              <option value="0">PLANIFICADA</option>
            </select>
            {errors.extraordinary && (
              <Error>{errors.extraordinary?.message?.toString()}</Error>
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
              <p className="font-bold text-lg">Crear Tarea Lote</p>
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
