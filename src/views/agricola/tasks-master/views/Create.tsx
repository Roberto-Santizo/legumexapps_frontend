import { useForm } from "react-hook-form";
import { DraftInsumoRecipe, DraftMasterTask } from "../types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getTasks } from "@/api/TasksAPI";
import { getRecipes, getCrops, createTaskGuideline } from "../api/api";
import { getFincas } from "@/api/FincasAPI";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModalCreateInsumoRecipe } from "../components/components";
import { useState } from "react";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import { useNotification } from "../../../../core/notifications/NotificationContext";

export default function Create() {
  const [insumos, setInsumos] = useState<DraftInsumoRecipe[]>([]);
  const navigate = useNavigate();
  const notify = useNotification();

  const { data: tasks } = useQuery({
    queryKey: ['getTasks'],
    queryFn: () => getTasks({ paginated: '', page: 1, filters: { name: '', code: '' } })
  });

  const { data: recipes } = useQuery({
    queryKey: ['getRecipes'],
    queryFn: getRecipes
  });

  const { data: crops } = useQuery({
    queryKey: ['getCrops'],
    queryFn: getCrops
  });

  const { data: fincas } = useQuery({
    queryKey: ['getFincas'],
    queryFn: getFincas
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTaskGuideline,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data!);
      navigate('/maestro-tareas-fincas');
    }
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    control
  } = useForm<DraftMasterTask>();

  const onSubmit = (data: DraftMasterTask) => {
    data.insumos = insumos;
    mutate(data);
  }

  const tasksOptions = tasks?.data.map((task) => {
    return { value: task.id, label: `${task.name} - ${task.code}` }
  })
  const recipesOptions = recipes?.data.map((recipe) => {
    return { value: recipe.id, label: recipe.name }
  })
  const cropsOptions = crops?.map((crop) => {
    return { value: crop.id, label: `${crop.name} - ${crop.code}` }
  })
  const fincasOptions = fincas?.map((finca) => {
    return { value: finca.id, label: `${finca.name} - ${finca.code}` }
  })

  const handleOpenModal = () => {
    navigate(`${location.pathname}?addInsumo=true`);
  }

  const handleDeleteInsumo = (id: DraftInsumoRecipe['insumo_id']) => {
    setInsumos(
      insumos.filter(insumo => insumo.insumo_id != id)
    );
  }

  return (
    <div>
      <h2 className="text-4xl font-bold">Crear Tarea Maestra</h2>
      <form className="w-2/3 mx-auto mt-10 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <InputSelectSearchComponent<DraftMasterTask>
          label="Tareas"
          id="task_id"
          name="task_id"
          options={tasksOptions ?? []}
          control={control}
          rules={{ required: 'La tarea es requerida' }}
          errors={errors}
        >
          {errors.task_id && <Error>{errors.task_id?.message?.toString()}</Error>}
        </InputSelectSearchComponent>

        <InputSelectSearchComponent<DraftMasterTask>
          label="Cultivos"
          id="crop_id"
          name="crop_id"
          options={cropsOptions ?? []}
          control={control}
          rules={{ required: 'El cultivo es requerido' }}
          errors={errors}
        >
          {errors.crop_id && <Error>{errors.crop_id?.message?.toString()}</Error>}
        </InputSelectSearchComponent>

        <InputSelectSearchComponent<DraftMasterTask>
          label="Recetas"
          id="recipe_id"
          name="recipe_id"
          options={recipesOptions ?? []}
          control={control}
          rules={{ required: 'La receta es requerida' }}
          errors={errors}
        >
          {errors.recipe_id && <Error>{errors.recipe_id?.message?.toString()}</Error>}
        </InputSelectSearchComponent>

        <InputSelectSearchComponent<DraftMasterTask>
          label="Finca"
          id="finca_id"
          name="finca_id"
          options={fincasOptions ?? []}
          control={control}
          rules={{ required: 'La finca es requerida' }}
          errors={errors}
        >
          {errors.finca_id && <Error>{errors.finca_id?.message?.toString()}</Error>}
        </InputSelectSearchComponent>

        <InputComponent<DraftMasterTask>
          label="Horas"
          id="hours"
          name="hours"
          placeholder="Horas requeridas"
          register={register}
          validation={{ required: 'El campo es obligatorio', min: { value: 0, message: 'Las horas deben de ser mayor a 0' } }}
          errors={errors}
          type={'number'}
        >
          {errors.hours && <Error>{errors.hours?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftMasterTask>
          label="Presupuesto"
          id="budget"
          name="budget"
          placeholder="Presupuesto requerido"
          register={register}
          validation={{ required: 'El campo es obligatorio', min: { value: 0, message: 'El presupuesto debe de ser mayor a 0' } }}
          errors={errors}
          type={'number'}
        >
          {errors.budget && <Error>{errors.budget?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftMasterTask>
          label="Semana de Aplicación"
          id="week"
          name="week"
          placeholder="Semana de aplicación"
          register={register}
          validation={{ required: 'El campo es obligatorio', min: { value: 1, message: 'El presupuesto debe de ser mayor a 0' } }}
          errors={errors}
          type={'number'}
        >
          {errors.week && <Error>{errors.week?.message?.toString()}</Error>}
        </InputComponent>

        <fieldset className="border p-5">
          <legend className="font-bold text-2xl">Insumos: </legend>
          <button className="button bg-indigo-500 hover:bg-indigo-600 flex gap-2" type="button" onClick={() => handleOpenModal()}>
            <PlusIcon />
            <p>Agregar Insumo</p>
          </button>

          <table className="table mt-10">
            <thead>
              <tr className="thead-tr">
                <th scope="col" className="thead-th">
                  Insumo
                </th>
                <th scope="col" className="thead-th">
                  Cantidad
                </th>
                <th scope="col" className="thead-th">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {insumos.map((insumo) => (
                <tr className="tbody-tr" key={insumo.insumo_id}>
                  <td className="tbody-td">{insumo.name}</td>
                  <td className="tbody-td">{insumo.quantity}</td>
                  <td className="tbody-td">
                    <button type="button" onClick={() => handleDeleteInsumo(insumo.insumo_id)}>
                      <TrashIcon className="w-5 hover:text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </fieldset>

        <button disabled={isPending} type="submit" className="button bg-indigo-500 hover:bg-indigo-500 w-full">
          Crear
        </button>
      </form>

      <ModalCreateInsumoRecipe setInsumos={setInsumos} added_insumos={insumos} />
    </div>
  )
}
