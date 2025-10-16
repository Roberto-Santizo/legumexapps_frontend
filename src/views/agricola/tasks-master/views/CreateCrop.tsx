import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DraftCrop } from "../types";
import { createCrop } from "../api/api";
import { useNotification } from "../../../../core/notifications/NotificationContext";
import { useNavigate } from "react-router-dom";
import InputComponent from "@/components/form/InputComponent";
import Error from "@/components/utilities-components/Error";

export default function CreateCrop() {
  const notify = useNotification();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<DraftCrop>();

  const { mutate, isPending } = useMutation({
    mutationFn: createCrop,
    onSuccess: (data) => {
      notify.success(data!);
      queryClient.invalidateQueries({ queryKey: ['getCrops'] });
      navigate('/maestro-tareas-fincas/cultivos');

    },
    onError: (error) => {
      notify.error(error.message);
    }
  });

  const onSubmit = (data: DraftCrop) => {
    mutate(data);
  }

  return (
    <div>
      <h2 className="text-4xl font-bold">Crear Cultivo</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 mt-5 mx-auto space-y-5 shadow p-5">
        <InputComponent<DraftCrop>
          label="Nombre"
          id="name"
          name="name"
          placeholder="Nombre del cultivo"
          register={register}
          validation={{ required: 'El campo es obligatorio' }}
          errors={errors}
          type={'text'}
        >
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftCrop>
          label="Código"
          id="code"
          name="code"
          placeholder="Código del Cultivo"
          register={register}
          validation={{ required: 'El campo es obligatorio' }}
          errors={errors}
          type={'text'}
        >
          {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
        </InputComponent>

        <button disabled={isPending} type="submit" className="button bg-indigo-500 hover:bg-indigo-500 w-full">
          Crear
        </button>
      </form>
    </div>
  )
}
