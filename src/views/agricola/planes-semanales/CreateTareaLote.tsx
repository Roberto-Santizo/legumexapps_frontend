import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Lote } from "@/api/LotesAPI";
import { getTasks } from "@/api/TasksAPI";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Delete, PlusIcon } from "lucide-react";
import { toast } from "react-toastify";
import { createTaskWeeklyPlan } from "@/api/TasksWeeklyPlanAPI";
import { getCurrentDate } from "@/helpers";
import { FiltersTasksInitialValues } from "../tareas/IndexTareas";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";
import ModalAddInsumo from "@/components/modals/ModalAddInsumo";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import InputSelectComponent from "@/components/form/InputSelectComponent";
import InputComponent from "@/components/form/InputComponent";
import { WeeklyPlan } from "@/api/WeeklyPlansAPI";

export type DraftSelectedInsumo = {
  insumo_id: string;
  quantity: string;
  name: string;
}

export type DraftNewTaskWeeklyPlan = {
  weekly_plan_id: string;
  lote_id: string;
  tarea_id: string;
  workers_quantity: string;
  budget: string;
  hours: string;
  extraordinary: string;
  insumos: DraftSelectedInsumo[],
  operation_date: string;
}

type Props = {
  plans: WeeklyPlan[];
  lotes: Lote[];
}

export default function CreateTareaLote({ plans, lotes }: Props) {
  const [selectedInsumos, setSelectedInsumos] = useState<DraftSelectedInsumo[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createTaskWeeklyPlan,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/planes-semanales');
    }
  });
  const { data: tasks } = useQuery({
    queryKey: ['getAllTasks'],
    queryFn: () => getTasks({ page: 1, filters: FiltersTasksInitialValues, paginated: '' }),
  });

  const lotesOptions = lotes.map((lote) => ({
    value: lote.id,
    label: lote.name,
  }));

  const tareasOptions = tasks?.data.map((lote) => ({
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
  } = useForm<DraftNewTaskWeeklyPlan>();

  const deleteItem = (insumo_id: DraftSelectedInsumo['insumo_id']) => {
    const newSelectedItems = selectedInsumos.filter(insumo => insumo.insumo_id != insumo_id);
    setSelectedInsumos(newSelectedItems)
  }

  const CreateTareaLote = async (data: DraftNewTaskWeeklyPlan) => {
    const FormData = {
      ...data,
      insumos: selectedInsumos
    }

    mutate({ FormData });
  };
  return (
    <>
      <div className="my-10 w-2/3 mx-auto">
        <form
          onSubmit={handleSubmit(CreateTareaLote)}
          className="space-y-5 shadow-xl p-5"
          noValidate
        >
          <InputComponent<DraftNewTaskWeeklyPlan>
            label="Empleados Necesarios"
            id="workers_quantity"
            name="workers_quantity"
            placeholder="Empleados necesarios para la tarea"
            register={register}
            validation={{
              required: "El número de empleados es obligatorio",
              min: {
                value: 1,
                message: "El número de empleados debe de ser mayor a 0",
              },
            }
            }
            errors={errors}
          >
            {errors.workers_quantity && <Error>{errors.workers_quantity?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftNewTaskWeeklyPlan>
            label="Horas"
            id="hours"
            name="hours"
            placeholder="Horas Necesarias Para Realizar la Tarea"
            register={register}
            validation={{
              required: "El número de horas es obligatorio",
              min: {
                value: 1,
                message: "El número de horas debe de ser mayor a 0",
              },
            }}
            errors={errors}
          >
            {errors.hours && <Error>{errors.hours?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftNewTaskWeeklyPlan>
            label="Presupuesto"
            id="budget"
            name="budget"
            placeholder="Presupuesto De La Tarea"
            register={register}
            validation={{
              required: "El presupuesto es obligatorio",
              min: {
                value: 1,
                message: "El presupuesto debe de ser mayor a 0",
              },
            }}
            errors={errors}
          >
            {errors.budget && <Error>{errors.budget?.message?.toString()}</Error>}
          </InputComponent>


          <InputSelectSearchComponent<DraftNewTaskWeeklyPlan>
            label="Lote"
            id="lote_id"
            name="lote_id"
            options={lotesOptions}
            control={control}
            rules={{ required: 'El lote es obligatorio' }}
            errors={errors}
          >
            {errors.lote_id && <Error>{errors.lote_id?.message?.toString()}</Error>}
          </InputSelectSearchComponent>

          <InputSelectSearchComponent<DraftNewTaskWeeklyPlan>
            label="Tarea"
            id="tarea_id"
            name="tarea_id"
            options={tareasOptions ? tareasOptions : []}
            control={control}
            rules={{ required: "La tarea a realizar es obligatoria" }}
            errors={errors}
          >
            {errors.tarea_id && <Error>{errors.tarea_id?.message?.toString()}</Error>}
          </InputSelectSearchComponent>

          <InputSelectSearchComponent<DraftNewTaskWeeklyPlan>
            label="Plan Semanal Destino"
            id="weekly_plan_id"
            name="weekly_plan_id"
            options={plansOptions}
            control={control}
            rules={{ required: "El plan semanal destino es obligatorio" }}
            errors={errors}
          >
            {errors.weekly_plan_id && <Error>{errors.weekly_plan_id?.message?.toString()}</Error>}
          </InputSelectSearchComponent>

          <InputSelectComponent<DraftNewTaskWeeklyPlan>
            label="Tipo de Tarea"
            id="extraordinary"
            name="extraordinary"
            options={[{ label: 'Extraordinaria', value: '1' }, { label: 'Planificada', value: '0' }]}
            register={register}
            validation={{ required: "Especifique el tipo de tarea" }}
            errors={errors}
          >
            {errors.extraordinary && <Error>{errors.extraordinary?.message?.toString()}</Error>}
          </InputSelectComponent>

          <InputComponent<DraftNewTaskWeeklyPlan>
            label="Fecha de Operación"
            id="operation_date"
            name="operation_date"
            placeholder=""
            register={register}
            validation={{ required: 'La fecha de operación es obligatoria' }}
            errors={errors}
            type={'date'}
            min={getCurrentDate()}
          >
            {errors.operation_date && <Error>{errors.operation_date?.message?.toString()}</Error>}
          </InputComponent>

          <fieldset className="border p-5">
            <legend className="font-bold text-3xl">Insumos</legend>
            <button type="button" className="button bg-indigo-500 hover:bg-indigo-600 flex" onClick={() => setOpen(true)}>
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

          <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Crear Tarea Lote</p>}
          </button>
        </form>
      </div>

      <ModalAddInsumo open={open} setOpen={setOpen} setSelectedInsumos={setSelectedInsumos} />
    </>
  );
}
