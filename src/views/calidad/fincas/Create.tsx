import { createFinca, DraftFinca } from "@/api/FincasAPI";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/core/notifications/NotificationContext";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";
import Spinner from "@/components/utilities-components/Spinner";

export default function Create() {
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: DraftFinca) => createFinca(data),
    onSuccess: (message) => {
      success(message);
      navigate('/fincas', { replace: true });
    },
    onError: (err) => {
      error(err.message);
    }
  });

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<DraftFinca>();

  const onSubmit = (data: DraftFinca) => mutate(data);
  return (
    <div>
      <form className="md:w-2/3 mx-auto mt-10 space-y-5 shadow-xl p-10" onSubmit={handleSubmit(onSubmit)}>

        <InputComponent<DraftFinca>
          label="Finca"
          id="name"
          name="name"
          placeholder="Nombre de la Finca"
          register={register}
          validation={{ required: 'El nombre de la finca es obligatoria' }}
          errors={errors}
          type={'text'}
        >
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftFinca>
          label="Código"
          id="code"
          name="code"
          placeholder="Código de la Finca"
          register={register}
          validation={{ required: 'El código de la finca es obligatoria' }}
          errors={errors}
          type={'text'}
        >
          {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
        </InputComponent>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Finca</p>}
        </button>
      </form>
    </div>
  )
}
