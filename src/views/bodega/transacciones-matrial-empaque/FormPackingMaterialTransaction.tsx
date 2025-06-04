import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { DraftTransactionPackingMaterial } from "@/components/modals/ModalEntregaMaterialEmpaque";
import { useQuery } from "@tanstack/react-query";
import { getTasksProduction, TaskProduction } from "@/api/WeeklyProductionPlanAPI";
import { useEffect, useState } from "react";
import InputSelectComponent from "@/components/form/InputSelectComponent";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";

type Props = {
  errors: FieldErrors<DraftTransactionPackingMaterial>;
  register: UseFormRegister<DraftTransactionPackingMaterial>;
  control: Control<DraftTransactionPackingMaterial, any>
};

export default function FormPackingMaterialTransaction({ errors, register, control }: Props) {

  const [tasks, setTasks] = useState<TaskProduction[]>([]);
  const optionsType = [
    { value: "1", label: "ENTREGA" },
    { value: "2", label: "DEVOLUCIÓN" },
  ]


  const { data } = useQuery({
    queryKey: ['getTasksProduction'],
    queryFn: getTasksProduction,
  });

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  const tasksOptions = tasks.map((task) => ({
    label: `${task.line} - ${task.product} - ${task.code} - ${task.operation_date}`,
    value: task.id,
  }))
  return (
    <>
      <InputComponent<DraftTransactionPackingMaterial>
        label="Referencia"
        id="reference"
        name="reference"
        placeholder="Ingrese la referencia"
        register={register}
        validation={{ required: "La referencia es obligatoria" }}
        errors={errors}
        type={"text"}
      >
        {errors.reference && (
          <Error>{errors.reference?.message?.toString()}</Error>
        )}
      </InputComponent>

      <InputComponent<DraftTransactionPackingMaterial>
        label="Responsable"
        id="responsable"
        name="responsable"
        placeholder="Ingrese el responsable de cajas"
        register={register}
        validation={{ required: "El nombre del responsable es obligatorio" }}
        errors={errors}
        type={"text"}
      >
        {errors.responsable && (
          <Error>{errors.responsable?.message?.toString()}</Error>
        )}
      </InputComponent>
      <InputComponent<DraftTransactionPackingMaterial>
        label="observaciones"
        id="observations"
        name="observations"
        placeholder="Ingrese el responsable de bolsas"
        register={register}
        validation={{}}
        errors={errors}
        type={"text"}
      >
        {errors.observations && (
          <Error>{errors.observations?.message?.toString()}</Error>
        )}
      </InputComponent>

      <InputSelectComponent<DraftTransactionPackingMaterial>
        label="Tipo de transacción"
        id="type"
        name="type"
        options={optionsType}
        register={register}
        validation={{ required: "El tipo de transacción es obligatorio" }}
        errors={errors}
      >
        {errors.type && <Error>{errors.type?.message?.toString()}</Error>}
      </InputSelectComponent>

      <InputSelectSearchComponent<DraftTransactionPackingMaterial>
        label="Tarea de producción"
        id="task_production_plan_id"
        name="task_production_plan_id"
        options={tasksOptions}
        control={control}
        rules={{}}
        errors={errors}
      >
        {errors.task_production_plan_id && <Error>{errors?.task_production_plan_id.message?.toString()}</Error>}
      </InputSelectSearchComponent>

    </>
  );
}
