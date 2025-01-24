import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect } from "react";
import Spinner from "../../../components/Spinner";
import { useForm } from "react-hook-form";
import { DraftTaskWeeklyPlan } from "../../../types";
import Error from "../../../components/Error";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

export default function EditarTareaLote() {
  const { id } = useParams();
  const location = useLocation();
  const previousUrl = location.state?.previousUrl || "/dashboard";
  const getTask = useAppStore((state) => state.getTask);
  const loadingGetTask = useAppStore((state) => state.loadingGetTask);
  const errorGetTask = useAppStore((state) => state.errorGetTask);
  const fetchPlans = useAppStore((state) => state.fetchPlans);
  const loadingEditTask = useAppStore((state) => state.loadingEditTask);
  const userRole = useAppStore((state) => state.userRole);
  const loadingFetchPlans = useAppStore((state) => state.loadingFetchPlans);
  const errorFetchPlans = useAppStore((state) => state.errorFetchPlans);
  const navigate = useNavigate();
  const editTask = useAppStore((state) => state.editTask);
  const plans = useAppStore((state) => state.weeklyPlans);
  const task = useAppStore((state) => state.task);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DraftTaskWeeklyPlan>();

  useEffect(() => {
    if (id) {
      (async () => {
        await getTask(id);
      })();
    }
    fetchPlans();
  }, []);

  useEffect(() => {
    if (task) {
      setValue("budget", task.budget);
      setValue("hours", task.hours);
      setValue("weekly_plan_id", task.weekly_plan_id);
      setValue("start_date", task.start_date || "");
      setValue("start_time", task.start_time || "");
      setValue("end_date", task.end_date || "");
      setValue("end_time", task.end_time || "");
    }
  }, [task]);

  const editTaskForm = (data: DraftTaskWeeklyPlan) => {
    if (id) {
      editTask(data, id).then(() => {
        navigate(previousUrl);
        toast.success("Tarea Editada Correctamente");
      });
    }
  };
  return (
    <>
      <h2 className="text-4xl font-bold">Editar Tarea</h2>
      {loadingGetTask && <Spinner />}

      {!loadingGetTask && !errorGetTask && (
        <form
          className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
          onSubmit={handleSubmit(editTaskForm)}
          noValidate
        >
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="budget">
              Presupuesto de la Tarea:
            </label>
            <input
              autoComplete="off"
              id="budget"
              type="number"
              placeholder={"Presupuesto de la Tarea"}
              className="border border-black p-3"
              {...register("budget", {
                required: "El presupuesto es obligatorio",
              })}
            />
            {errors.budget && (
              <Error>{errors.budget?.message?.toString()}</Error>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="hours">
              Horas Necesarias:
            </label>
            <input
              autoComplete="off"
              id="hours"
              type="number"
              placeholder={"Horas Necesarias"}
              className="border border-black p-3"
              {...register("hours", { required: "Las horas son obligatorias" })}
            />
            {errors.hours && <Error>{errors.hours?.message?.toString()}</Error>}
          </div>

          {loadingFetchPlans && <Spinner />}
          {!loadingFetchPlans && !errorFetchPlans && (
            <div className="flex flex-col gap-2">
              <label
                className="text-lg font-bold uppercase"
                htmlFor="weekly_plan_id"
              >
                Plan Semanal:
              </label>

              <select
                id="weekly_plan_id"
                className="border border-black p-3"
                {...register("weekly_plan_id", {
                  required: "El rol es obligatorio",
                })}
              >
                <option value="">--SELECCIONE UNA OPCIÓN--</option>
                {plans.map((plan) => (
                  <option value={plan.id} key={plan.id}>
                    {plan.finca} - {plan.week}
                  </option>
                ))}
              </select>

              {errors.weekly_plan_id && (
                <Error>{errors.weekly_plan_id?.message?.toString()}</Error>
              )}
            </div>
          )}

          {userRole === "admin" && (
            <fieldset className="space-y-5 shadow p-2">
              <legend className="font-bold text-3xl text-center">
                Fechas de Asignación
              </legend>

              {task.start_date && (
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2 p-2">
                    <label
                      className="text-lg font-bold uppercase"
                      htmlFor="start_date"
                    >
                      Fecha de Inicio
                    </label>

                    <input
                      type="date"
                      {...register("start_date")}
                      className="border border-black p-2"
                    />
                    {errors.start_date && (
                      <Error>{errors.start_date?.message?.toString()}</Error>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 p-2">
                    <label
                      className="text-lg font-bold uppercase"
                      htmlFor="start_time"
                    >
                      Hora de Inicio
                    </label>

                    <input
                      type="time"
                      {...register("start_time")}
                      className="border border-black p-2"
                    />
                    {errors.start_time && (
                      <Error>{errors.start_time?.message?.toString()}</Error>
                    )}
                  </div>
                </div>
              )}

              {task.end_date && (
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2 p-2">
                    <label
                      className="text-lg font-bold uppercase"
                      htmlFor="end_date"
                    >
                      Fecha de Cierre
                    </label>

                    <input
                      type="date"
                      {...register("end_date")}
                      className="border border-black p-2"
                    />
                    {errors.end_date && (
                      <Error>{errors.end_date?.message?.toString()}</Error>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 p-2">
                    <label
                      className="text-lg font-bold uppercase"
                      htmlFor="end_time"
                    >
                      Hora de Cierre
                    </label>

                    <input
                      type="time"
                      {...register("end_time")}
                      className="border border-black p-2"
                    />
                    {errors.end_time && (
                      <Error>{errors.end_time?.message?.toString()}</Error>
                    )}
                  </div>
                </div>
              )}
            </fieldset>
          )}

          <Button
            disabled={loadingEditTask}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {loadingEditTask ? (
              <Spinner />
            ) : (
              <p className="font-bold text-lg">Guardar Cambios</p>
            )}
          </Button>
        </form>
      )}
    </>
  );
}
