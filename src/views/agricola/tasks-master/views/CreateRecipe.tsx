import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DraftRecipe } from "../types";
import { createRecipe } from "../api/api";
import { useNotification } from "../../../../core/notifications/NotificationContext";
import { useNavigate } from "react-router-dom";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";

export default function CreateRecipe() {
  const notify = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    formState: { errors },
    register,
    handleSubmit
  } = useForm<DraftRecipe>();

  const { mutate, isPending } = useMutation({
    mutationFn: createRecipe,
    onSuccess: (data) => {
      notify.success(data!);
      navigate('/maestro-tareas-fincas/recetas');
      queryClient.invalidateQueries({ queryKey: ['getRecipes'] });
    },
    onError: (error) => {
      notify.error(error.message);
    }
  });

  const onSubmit = (data: DraftRecipe) => {
    mutate(data);
  }
  return (
    <div>
      <h2 className="text-4xl font-bold">Crear Receta</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 mt-5 mx-auto space-y-5 shadow p-5">
        <InputComponent<DraftRecipe>
          label="Nombre"
          id="name"
          name="name"
          placeholder="Nombre de la receta"
          register={register}
          validation={{ required: 'El campo es obligatorio' }}
          errors={errors}
          type={'text'}
        >
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>

        <button disabled={isPending} type="submit" className="button bg-indigo-500 hover:bg-indigo-500 w-full">
          Crear
        </button>
      </form>
    </div>
  )
}
