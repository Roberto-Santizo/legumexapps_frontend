import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Finca, getFincas } from "@/api/FincasAPI";
import { createLote } from "@/api/LotesAPI";
import { useQueries, useMutation } from "@tanstack/react-query";
import { useNotification } from "../../../core/notifications/NotificationContext";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";
import InputComponent from "@/components/form/InputComponent";
import InputSelectSearchComponent from "@/components/form/InputSelectSearchComponent";

export type DraftLote = {
  name: string;
  finca_id: string;
}

export default function Create() {
  const [fincas, setFincas] = useState<Finca[]>([]);
  const navigate = useNavigate();
  const notify = useNotification();

  const results = useQueries({
    queries: [
      { queryKey: ['getAllFincas'], queryFn: getFincas },
    ]
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createLote,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      navigate('/lotes');
    }
  });

  useEffect(() => {
    if (results) {
      if (results[0].data) setFincas(results[0].data);
    }
  }, [results]);


  const fincasOptions = fincas.map((finca) => ({
    value: finca.id,
    label: finca.name,
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DraftLote>();


  const onSubmit = (data: DraftLote) => mutate(data);

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Lote</h2>
      <form
        className="xl:w-1/2 mx-auto p-5 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >

        <InputComponent<DraftLote>
          label="Nombre"
          id="name"
          name="name"
          placeholder="Nombre del lote"
          register={register}
          validation={{ required: 'El nombre del lote es obligatorio' }}
          errors={errors}
          type={'text'}
        >
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </InputComponent>


        <InputSelectSearchComponent<DraftLote>
          label="Finca"
          id="finca_id"
          name="finca_id"
          options={fincasOptions}
          control={control}
          rules={{ required: 'La finca es obligatoria' }}
          errors={errors}
        >
          {errors.finca_id && <Error>{errors.finca_id?.message?.toString()}</Error>}
        </InputSelectSearchComponent>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Lote</p>}
        </button>
      </form>
    </>
  );
}
