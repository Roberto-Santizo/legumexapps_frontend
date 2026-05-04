import { createProductorCdp, DraftProductorCdp } from "@/api/ProductorPlantationAPI";
import { getFincas } from "@/api/FincasAPI";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useNotification } from '../../../core/notifications/NotificationContext';
import Error from "@/components/utilities-components/Error";
import InputComponent from "@/components/form/InputComponent";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import Spinner from "@/components/utilities-components/Spinner";

export default function Create() {
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    control
  } = useForm<DraftProductorCdp>();

  const { data: fincas } = useQuery({
    queryKey: ["getAllFincas"], queryFn: getFincas,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: DraftProductorCdp) => createProductorCdp(data),
    onSuccess: (message) => {
      success(message);
      navigate('/productor-cdps', { replace: true });
    },
    onError: (err) => {
      error(err.message);
    }
  });

  const fincasOptions = fincas?.map((finca) => ({
    value: finca.id,
    label: `${finca.name}`,
  }));

  const onSubmit = (data: DraftProductorCdp) => mutate(data);

  return (
    <div>
      <form className="md:w-2/3 mx-auto mt-10 space-y-5 shadow-xl p-10" onSubmit={handleSubmit(onSubmit)}>

        <InputComponent<DraftProductorCdp>
          label="Nombre del CDP"
          id="name"
          name="name"
          placeholder="CDP, ej; LS20001"
          register={register}
          validation={{ required: 'El nombre del CDP es obligatoria' }}
          errors={errors}
          type={'text'}
        >
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>

        <InputSelectSearchComponent<DraftProductorCdp>
          label="Finca"
          id="finca_id"
          name="finca_id"
          options={fincasOptions ?? []}
          control={control}
          rules={{ required: 'Seleccione un transportista' }}
          errors={errors}
        >
          {errors.finca_id && <Error>{errors.finca_id?.message?.toString()}</Error>}
        </InputSelectSearchComponent>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear CDP</p>}
        </button>
      </form>
    </div>
  )
}
