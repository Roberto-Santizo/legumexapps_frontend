import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { DraftCreateTaskWeeklyPlan, Lote, Tarea, WeeklyPlan } from "@/types";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Error from "@/components/Error";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllPlans } from "@/api/WeeklyPlansAPI";
import { getAllLotes } from "@/api/LotesAPI";
import { getAllTasks } from "@/api/TasksAPI";
import { useQueries } from "@tanstack/react-query";
import { Delete, PlusIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import ModalAddInsumo from "@/components/ModalAddInsumo";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

export type DraftSelectedInsumo = {
  insumo_id: string,
  quantity: string,
  name: string
}

export default function CreateTareaLote() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [plans, setPlans] = useState<WeeklyPlan[]>([]);
  const [selectedInsumos, setSelectedInsumos] = useState<DraftSelectedInsumo[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const createTaskWeeklyPlan = useAppStore((state) => state.createTaskWeeklyPlan);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ data, selectedInsumos }: { data: DraftCreateTaskWeeklyPlan, selectedInsumos: DraftSelectedInsumo[] }) => createTaskWeeklyPlan(data, selectedInsumos),
    onError: () => {
      toast.error('Hubo un error al crear la tarea, vuelva a intentarlo más tarde')
    },
    onSuccess: () => {
      toast.success('Tarea Creada Correctamente');
      navigate('/planes-semanales');
    }
  });
  const results = useQueries({
    queries: [
      { queryKey: ['getAllLotes'], queryFn: getAllLotes },
      { queryKey: ['getAllTasks'], queryFn: getAllTasks },
      { queryKey: ['getAllPlans'], queryFn: getAllPlans }
    ]
  })

  useEffect(() => {
    if (results[0].data) setLotes(results[0].data)
    if (results[1].data) setTareas(results[1].data)
    if (results[2].data) setPlans(results[2].data)
  }, [results])

  useEffect(() => {
    console.log(selectedInsumos);
  }, [selectedInsumos])


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

  const deleteItem = (insumo_id: DraftSelectedInsumo['insumo_id']) => {
    const newSelectedItems = selectedInsumos.filter(insumo => insumo.insumo_id != insumo_id);
    setSelectedInsumos(newSelectedItems)
  }

  const CreateTareaLote = async (data: DraftCreateTaskWeeklyPlan) => mutate({ data, selectedInsumos });
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

          <fieldset className="border p-5">
            <legend className="font-bold text-3xl">Insumos</legend>
            <button type="button" className="button bg-blue-500 hover:bg-blue-600 flex" onClick={() => setOpen(true)}>
              <PlusIcon />
              <p>Agregar Insumo</p>
            </button>

            {selectedInsumos.length > 0 ? (
              <table className="table mt-5">
                <thead>
                  <tr className="thead-tr">
                    <th className="thead-th">Insumo</th>
                    <th className="thead-th">Cantidad</th>
                    <th className="thead-th">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInsumos.map(item => (
                    <tr className="tbody-tr" key={item.insumo_id}>
                      <td className="tbody-td">{item.name}</td>
                      <td className="tbody-td">{item.quantity}</td>
                      <td className="tbody-td">
                        <Delete className="cursor-pointer hover:text-gray-500" onClick={() => deleteItem(item.insumo_id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (<p className="mt-5 text-center">No existen insumos relacionados</p>)}

          </fieldset>

          <Button
            disabled={isPending}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <p className="font-bold text-lg">Crear Tarea Lote</p>
            )}
          </Button>
        </form>
      </div>

      <ModalAddInsumo open={open} setOpen={setOpen} setSelectedInsumos={setSelectedInsumos} />
    </>
  );
}
