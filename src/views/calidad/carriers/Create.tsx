import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createTransportista, DraftTransportista } from "@/api/TransportistasAPI";
import { useNavigate } from "react-router-dom";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";
import InputComponent from "@/components/form/InputComponent";
import { useNotification } from "../../../core/notifications/NotificationContext";

export default function Create() {
  const navigate = useNavigate();
  const notify = useNotification();

  const { mutate, isPending } = useMutation({
    mutationFn: createTransportista,
    onError: () => {
      notify.error('Hubo un error al crear el transportista');
    },
    onSuccess: () => {
      notify.success('Transportista creado correctamente');
      navigate('/transportistas');
    }

  });

  const {
    handleSubmit,
    formState: { errors },
    register
  } = useForm<DraftTransportista>();

  const onSubmit = (data: DraftTransportista) => mutate(data)
  return (
    <>
      <h1 className="md:text-4xl text-xl text-center md:text-left font-bold">Crear Transportista</h1>

      <form className="md:w-3/4 shadow-xl p-10 mx-auto mt-10 space-y-10" onSubmit={handleSubmit(onSubmit)}>
        <InputComponent<DraftTransportista>
          label="Codigo del Transportista"
          id="code"
          name="code"
          placeholder="Codigo de Transportista"
          register={register}
          validation={{ required: 'El codigo del transportista es obligatorio' }}
          errors={errors}
          type={'text'}
        >
          {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftTransportista>
          label="Nombre del Transportista"
          id="name"
          name="name"
          placeholder="Nombre del Transportista"
          register={register}
          validation={{ required: 'El nombre transportista es obligatorio' }}
          errors={errors}
          type={'text'}
        >
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>
        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Transportista</p>}
        </button>
      </form>
    </>
  )
}
