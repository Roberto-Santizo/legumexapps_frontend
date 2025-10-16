import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createCDP } from "@/api/PlantationControlAPI";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "../../../core/notifications/NotificationContext";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";


export type DraftCDP = {
  name: string;
  start_date: string;
  end_date: string;
}

export default function Create() {
  const navigate = useNavigate();
  const notify = useNotification();

  const { mutate, isPending } = useMutation({
    mutationFn: createCDP,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      navigate('/cdps');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftCDP>();

  const handleCreateCDP = async (data: DraftCDP) => mutate(data);

  return (
    <>
      <h2 className="text-xl text-center xl:text-left xl:text-4xl font-bold">Crear Control de Plantación</h2>

      <form
        action=""
        className="space-y-5 xl:w-2/3 mx-auto p-5 mt-10"
        onSubmit={handleSubmit(handleCreateCDP)}
      >
        <InputComponent<DraftCDP>
          label="Control de plantación"
          id="name"
          name="name"
          placeholder="Nombre del CDP"
          register={register}
          validation={{ required: 'El nombre del CDP es obligatorio' }}
          errors={errors}
          type={'text'}
        >
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftCDP>
          label="Fecha de Inicio del CDP"
          id="start_date"
          name="start_date"
          placeholder=""
          register={register}
          validation={{ required: 'Fecha de inicio del CDP es obligatorio' }}
          errors={errors}
          type={'date'}
        >
          {errors.start_date && <Error>{errors.start_date?.message?.toString()}</Error>}
        </InputComponent>

         <InputComponent<DraftCDP>
          label="Fecha Final del CDP"
          id="end_date"
          name="end_date"
          placeholder=""
          register={register}
          validation={{ required: 'Fecha de inicio del CDP es obligatorio' }}
          errors={errors}
          type={'date'}
        >
          {errors.end_date && <Error>{errors.end_date?.message?.toString()}</Error>}
        </InputComponent>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear CDP</p>}
        </button>
      </form>
    </>
  );
}
