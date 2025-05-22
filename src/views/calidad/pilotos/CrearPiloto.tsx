import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getTransportistas, Transportista } from "@/api/TransportistasAPI";
import { useEffect, useState } from "react";
import { createPiloto, DraftPiloto } from "@/api/PilotosAPI";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";
import InputComponent from "@/components/form/InputComponent";

export default function CrearPiloto() {

  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getAllTransportistas'],
    queryFn: () => getTransportistas({ page: 1, paginated: '' }),
  });

  useEffect(() => {
    if (data) {
      setTransportistas(data.data);
    }
  }, [data]);

  const transportistasOptions = transportistas.map((transportista) => ({
    value: transportista.id,
    label: `${transportista.code} - ${transportista.name}`,
  }));

  const { mutate, isPending } = useMutation({
    mutationFn: createPiloto,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/transportistas/pilotos');
    }
  });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm<DraftPiloto>();

  const onSubmit = (data: DraftPiloto) => mutate(data)

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  return (
    <div>
      <h1 className="font-bold text-3xl">Crear Piloto</h1>

      <form className="w-3/4 mb-10 shadow-xl p-10 mx-auto mt-10 space-y-10" onSubmit={handleSubmit(onSubmit)}>
        <InputComponent<DraftPiloto>
          label="Nombre del piloto"
          id="name"
          name="name"
          placeholder="El nombre del piloto es obligatorio"
          register={register}
          validation={{ required: 'El nombre del piloto es obligatorio' }}
          errors={errors}
          type={'text'}
        >
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftPiloto>
          label="DPI del piloto"
          id="dpi"
          name="dpi"
          placeholder="DPI del transportista"
          register={register}
          validation={{}}
          errors={errors}
          type={'text'}
        >
          {errors.dpi && <Error>{errors.dpi?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<DraftPiloto>
          label="Licencia del piloto"
          id="license"
          name="license"
          placeholder="Licencia del piloto"
          register={register}
          validation={{}}
          errors={errors}
          type={'text'}
        >
          {errors.license && <Error>{errors.license?.message?.toString()}</Error>}
        </InputComponent>

        <InputSelectSearchComponent<DraftPiloto>
          label="Transportista"
          id="carrier_id"
          name="carrier_id"
          options={transportistasOptions}
          control={control}
          rules={{ required: 'El transportista es obligatorio' }}
          errors={errors}
        >
          {errors.carrier_id && <Error>{errors.carrier_id?.message?.toString()}</Error>}
        </InputSelectSearchComponent>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Piloto</p>}
        </button>
      </form>
    </div>
  )
}
