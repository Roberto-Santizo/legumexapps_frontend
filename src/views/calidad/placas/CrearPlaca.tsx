import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllTransportistas, Transportista } from "@/api/TransportistasAPI";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPlaca, DraftPlaca } from "@/api/PlacasAPI";
import { toast } from "react-toastify";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import InputComponent from "@/components/form/InputComponent";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";

export default function CrearPlaca() {
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getAllTransportistas'],
    queryFn: getAllTransportistas
  });

  useEffect(() => {
    if (data) {
      setTransportistas(data);
    }
  }, [data]);

  const transportistasOptions = transportistas.map((transportista) => ({
    value: transportista.id,
    label: `${transportista.code} - ${transportista.name}`,
  }));


  const { mutate, isPending } = useMutation({
    mutationFn: createPlaca,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/transportistas/placas');
    }
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
    control
  } = useForm<DraftPlaca>();

  const onSubmit = (data : DraftPlaca) => mutate(data);

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />

  return (
    <>
      <h1 className="font-bold text-3xl">Crear Placa</h1>

      <form className="w-1/2 mx-auto mt-10 space-y-5" onSubmit={handleSubmit(onSubmit)}>

        <InputComponent<DraftPlaca>
            label="Placa"
            id="name"
            name="name"
            placeholder="Placa, ej; C123ABC"
            register={register}
            validation={{required: 'La placa es obligatoria'}}
            errors={errors}
            type={'text'}
        >
            {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>        

        <InputSelectSearchComponent<DraftPlaca>
          label="Transportista"
          id="carrier_id"
          name="carrier_id"
          options={transportistasOptions}
          control={control}
          rules={{required:'Seleccione un transportista'}}
          errors={errors}
        >
            {errors.carrier_id && <Error>{errors.carrier_id?.message?.toString()}</Error>}
        </InputSelectSearchComponent>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Placa</p>}
        </button>
      </form>
    </>
  )
}
