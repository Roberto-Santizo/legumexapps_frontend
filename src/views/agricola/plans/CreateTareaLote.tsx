import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getTasks } from "@/api/TasksAPI";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Delete, PlusIcon } from "lucide-react";
import { createTaskWeeklyPlan, getFincaGroups } from "@/api/TasksWeeklyPlanAPI";
import { getCurrentDate } from "@/helpers";
import { FiltersTasksInitialValues } from "../tasks/Index";
import { DraftTaskWeeklyPlan } from "@/types/taskWeeklyPlanTypes";
import { useNotification } from "../../../core/notifications/NotificationContext";
import { getCDPS } from "../cdps/api/api";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";
import ModalAddInsumo from "@/components/modals/ModalAddInsumo";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import InputComponent from "@/components/form/InputComponent";

export type DraftSelectedInsumo = {
  insumo_id: string;
  quantity: string;
  name: string;
}


export default function CreateTareaLote() {
  const [selectedInsumos, setSelectedInsumos] = useState<DraftSelectedInsumo[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const params = useParams();
  const fincaId = params.finca_id!;
  const id = params.plan_id!;

  const navigate = useNavigate();
  const notify = useNotification();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['getPaginatedCDPS', fincaId],
    queryFn: () => getCDPS({ page: 1, filters: { cdp: '', end_date: '', start_date: '' }, paginated: '', finca: fincaId }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTaskWeeklyPlan,
    onError: (error) => {
      notify.error(error.message)
    },
    onSuccess: (data) => {
      notify.success(data!);
      queryClient.invalidateQueries({ queryKey: ['getTasksForCalendar', id] });
      navigate(location.pathname);
    }
  });

  const { data: tasks } = useQuery({
    queryKey: ['getAllTasks'],
    queryFn: () => getTasks({ page: 1, filters: FiltersTasksInitialValues, paginated: '' }),
  });

  const { data: groups } = useQuery({
    queryKey: ['getFincaGroups', fincaId, id],
    queryFn: () => getFincaGroups({ fincaId, plan: id }),
  });

  const tareasOptions = tasks?.data.map((lote) => ({
    value: lote.id,
    label: `${lote.code} ${lote.name}`,
  }));

  const groupsOptions = groups?.map((group) => ({
    value: `${group.id}`,
    label: group.code,
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DraftTaskWeeklyPlan>();

  const deleteItem = (insumo_id: DraftSelectedInsumo['insumo_id']) => {
    const newSelectedItems = selectedInsumos.filter(insumo => insumo.insumo_id != insumo_id);
    setSelectedInsumos(newSelectedItems)
  }

  const CreateTareaLote = async (data: DraftTaskWeeklyPlan) => {
    data.weekly_plan_id = id!;
    const FormData = {
      ...data,
      insumos: selectedInsumos
    }
    mutate({ FormData });
  };

  const cdps = data?.data.map((cdp) => ({
    value: cdp.id,
    label: `${cdp.name}`,
  }));

  if (cdps && groupsOptions) return (
    <>
      <form
        onSubmit={handleSubmit(CreateTareaLote)}
        className="space-y-5"
        noValidate
      >
        <InputComponent<DraftTaskWeeklyPlan>
          label="Empleados Necesarios"
          id="slots"
          name="slots"
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
          {errors.slots && <Error>{errors.slots?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftTaskWeeklyPlan>
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

        <InputComponent<DraftTaskWeeklyPlan>
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


        <InputSelectSearchComponent<DraftTaskWeeklyPlan>
          label="CDP"
          id="cdp_id"
          name="cdp_id"
          options={cdps}
          control={control}
          rules={{ required: 'El CDP es obligatorio' }}
          errors={errors}
        >
          {errors.cdp_id && <Error>{errors.cdp_id?.message?.toString()}</Error>}
        </InputSelectSearchComponent>

        <InputSelectSearchComponent<DraftTaskWeeklyPlan>
          label="Grupo"
          id="finca_group_id"
          name="finca_group_id"
          options={groupsOptions}
          control={control}
          rules={{ required: 'El CDP es obligatorio' }}
          errors={errors}
        >
          {errors.finca_group_id && <Error>{errors.finca_group_id?.message?.toString()}</Error>}
        </InputSelectSearchComponent>

        <InputSelectSearchComponent<DraftTaskWeeklyPlan>
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

        <InputComponent<DraftTaskWeeklyPlan>
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
      <ModalAddInsumo open={open} setOpen={setOpen} setSelectedInsumos={setSelectedInsumos} />
    </>
  );
}
