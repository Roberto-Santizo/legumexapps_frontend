import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { WeeklyPlan } from "@/types";
import { toast } from "react-toastify";
import { editTask, EditTaskWeeklyPlan, getEditTask } from "@/api/TasksWeeklyPlanAPI";
import { useQueries, useMutation } from "@tanstack/react-query";
import { getUserRole } from "@/api/UserAPI";
import InputComponent from "@/components/form/InputComponent";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import { getWeeklyPlans } from "@/api/WeeklyPlansAPI";
import { FiltersPlanSemanalInitialValues } from "../planes-semanales/IndexPlanSemanal";

export type DraftTaskWeeklyPlan = {
  hours: number,
  budget: number,
  slots: number,
  weekly_plan_id: string,
  start_date: string | null,
  start_time: string | null,
  end_date: string | null,
  end_time: string | null,
}

export default function EditarTareaLote() {
  const params = useParams();
  const id = params.id!!;
  const location = useLocation();
  const previousUrl = location.state?.previousUrl || "/planes-semanales";
  const [plans, setPlans] = useState<WeeklyPlan[]>([]);
  const [task, setTask] = useState<EditTaskWeeklyPlan>({} as EditTaskWeeklyPlan);
  const [role, setRole] = useState<string>('');

  const navigate = useNavigate();

  const results = useQueries({
    queries: [
      { queryKey: ['getTask', id], queryFn: () => getEditTask(id) },
      { queryKey: ['getUserRoleByToken'], queryFn: getUserRole },
      { queryKey: ['getAllPlans'], queryFn: () => getWeeklyPlans({ page: 1, filters: FiltersPlanSemanalInitialValues, paginated: '' }) },
    ]
  });

  useEffect(() => {
    if (results[0].data) setTask(results[0].data);
    if (results[1].data) setRole(results[1].data);
    if (results[2].data) setPlans(results[2].data.data);
  }, [results]);

  const plansOptions = plans.map((plan) => ({
    value: plan.id,
    label: `${plan.finca} - ${plan.week}`,
  }));

  const isLoading = results.some(result => result.isLoading);

  const { mutate, isPending } = useMutation({
    mutationFn: editTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      navigate(previousUrl);
      toast.success(data);
    }
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<DraftTaskWeeklyPlan>();

  useEffect(() => {
    if (task && plans.length > 0) {
      setValue("budget", task.budget);
      setValue("hours", task.hours);
      setValue("slots", task.slots);
      setValue("weekly_plan_id", task.weekly_plan_id);
      setValue("end_date", task.end_date);
      setValue("start_date", task.start_date);
      setValue("start_time", task.start_time);
      setValue("end_time", task.end_time);
    }
  }, [task, plans]);

  const editTaskForm = async (FormData: DraftTaskWeeklyPlan) => mutate({ id, FormData });

  if (isLoading) return <Spinner />
  return (
    <>
      <h2 className="text-4xl font-bold">Editar Tarea</h2>
      <form
        className="mt-10 w-3/4 mx-auto shadow-xl p-10 space-y-5 my-5"
        onSubmit={handleSubmit(editTaskForm)}
        noValidate
      >
        <InputComponent<DraftTaskWeeklyPlan>
          label="Presupuesto de la tarea"
          id="budget"
          name="budget"
          placeholder="Presupuesto de la Tarea"
          register={register}
          validation={{ required: 'El presupuesto de la tarea es obligatorio' }}
          errors={errors}
          type={'number'}
        >
          {errors.budget && <Error>{errors.budget?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftTaskWeeklyPlan>
          label="Horas Necesarias"
          id="hours"
          name="hours"
          placeholder="Horas Necesarias"
          register={register}
          validation={{ required: 'Las horas son obligatorias' }}
          errors={errors}
          type={'number'}
        >
          {errors.hours && <Error>{errors.hours?.message?.toString()}</Error>}
        </InputComponent>


        <InputComponent<DraftTaskWeeklyPlan>
          label="Cupos"
          id="slots"
          name="slots"
          placeholder="Cupos Necesarios para Realizar la Tarea"
          register={register}
          validation={{ required: 'Las horas son obligatorias' }}
          errors={errors}
          type={'number'}
        >
          {errors.slots && <Error>{errors.slots?.message?.toString()}</Error>}
        </InputComponent>

        <InputSelectSearchComponent<DraftTaskWeeklyPlan>
          label="Plan Semanal"
          id="weekly_plan_id"
          name="weekly_plan_id"
          options={plansOptions}
          control={control}
          rules={{ required: 'El plan semanal es obligatorio' }}
          errors={errors}
        >
          {errors.weekly_plan_id && <Error>{errors.weekly_plan_id?.message?.toString()}</Error>}
        </InputSelectSearchComponent>


        {((role === "admin" || role === 'adminagricola') && task.end_date && task.start_date) && (
          <fieldset>
            <div className="grid grid-cols-2 gap-5">
              <InputComponent<DraftTaskWeeklyPlan>
                label="Fecha de Inicio"
                id="start_date"
                name="start_date"
                placeholder=""
                register={register}
                validation={{}}
                errors={errors}
                type={'date'}
              >
                {errors.start_date && <Error>{errors.start_date?.message?.toString()}</Error>}
              </InputComponent>

              <InputComponent<DraftTaskWeeklyPlan>
                label="Hora de Inicio"
                id="start_time"
                name="start_time"
                placeholder=""
                register={register}
                validation={{}}
                errors={errors}
                type={'time'}
              >
                {errors.start_time && <Error>{errors.start_time?.message?.toString()}</Error>}
              </InputComponent>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <InputComponent<DraftTaskWeeklyPlan>
                label="Fecha de Cierre"
                id="end_date"
                name="end_date"
                placeholder=""
                register={register}
                validation={{}}
                errors={errors}
                type={'date'}
              >
                {errors.end_date && <Error>{errors.end_date?.message?.toString()}</Error>}
              </InputComponent>

              <InputComponent<DraftTaskWeeklyPlan>
                label="Hora de Cierre"
                id="end_time"
                name="end_time"
                placeholder=""
                register={register}
                validation={{}}
                errors={errors}
                type={'time'}
              >
                {errors.end_time && <Error>{errors.end_time?.message?.toString()}</Error>}
              </InputComponent>
            </div>
          </fieldset>
        )}

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
        </button>
      </form>
    </>
  );
}
