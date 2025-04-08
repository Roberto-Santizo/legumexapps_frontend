import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getCDPS, Plantation } from "@/api/PlantationControlAPI";
import { Finca, getAllFincas } from "@/api/FincasAPI";
import { createLote } from "@/api/LotesAPI";
import { toast } from "react-toastify";
import { useQueries, useMutation } from "@tanstack/react-query";
import Select from "react-select";
import Error from "@/components/utilities-components/Error";
import Spinner from "@/components/utilities-components/Spinner";

export type DraftLote = {
  name: string;
  cdp_id: string;
  finca_id: string;
}

export default function CreateLote() {
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [cdps, setCdps] = useState<Plantation[]>([]);
  const navigate = useNavigate();

  const results = useQueries({
    queries: [
      { queryKey: ['getAllFincas'], queryFn: getAllFincas },
      { queryKey: ['handleGetCDPS'], queryFn: getCDPS }
    ]
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createLote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/lotes');
    }
  });

  useEffect(() => {
    if (results) {
      if (results[0].data) setFincas(results[0].data);
      if (results[1].data) setCdps(results[1].data);
    }
  }, [results]);

  const cdpsOptions = cdps.map((cdp) => ({
    value: cdp.id,
    label: cdp.name,
  }));

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
        className="w-1/2 mx-auto p-5 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="name">
            Nombre:
          </label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder={"Nombre del lote"}
            className="border border-black p-3"
            {...register("name", {
              required: "El nombre del Lote es obligatorio",
            })}
          />
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}

          <div className="flex flex-col gap-2">
            <label
              className="text-lg font-bold uppercase"
              htmlFor="finca_id"
            >
              Finca:
            </label>

            <Controller
              name="finca_id"
              control={control}
              rules={{ required: "Seleccione una Finca" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={fincasOptions}
                  id="finca_id"
                  placeholder={"--SELECCIONE UNA OPCION--"}
                  onChange={(selected) => field.onChange(selected?.value)}
                  value={fincasOptions.find(
                    (option) => option.value === field.value
                  )}
                />
              )}
            />

            {errors.finca_id && (
              <Error>{errors.finca_id?.message?.toString()}</Error>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="cdp_id">
              CDP:
            </label>

            <Controller
              name="cdp_id"
              control={control}
              rules={{ required: "Seleccione un CDP" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={cdpsOptions}
                  id="cdp_id"
                  placeholder={"--SELECCIONE UNA OPCION--"}
                  onChange={(selected) => field.onChange(selected?.value)}
                  value={cdpsOptions.find(
                    (option) => option.value === field.value
                  )}
                />
              )}
            />

            {errors.cdp_id && (
              <Error>{errors.cdp_id?.message?.toString()}</Error>
            )}
          </div>
        </div>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Lote</p>}
        </button>
      </form>
    </>
  );
}
