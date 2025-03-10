import Error from "@/components/Error";
import { Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";
import { getAllTransportistas, Transportista } from "@/api/TransportistasAPI";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import Select from "react-select";
import { createPlaca, DraftPlaca } from "@/api/PlacasAPI";
import { toast } from "react-toastify";

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
    onError: () => {
      toast.error('Hubo un error al crear la placa');
    },
    onSuccess: () => {
      toast.success('Placa creado correctamente');
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
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="name">
            Placa:
          </label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder={"Placa, ej: C123ABC"}
            className="border border-black p-3"
            {...register("name", {
              required: "La placa es obligatoria",
            })}
          />
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </div>

        <div>
          <label className="text-lg font-bold uppercase" htmlFor="carrier_id">
            TRANSPORTISTA:
          </label>
          <Controller
            name="carrier_id"
            control={control}
            rules={{ required: "Seleccione un transportista" }}
            render={({ field }) => (
              <Select
                {...field}
                options={transportistasOptions}
                id="carrier_id"
                placeholder={"--SELECCIONE UNA OPCION--"}
                className="border border-black"
                onChange={(selected) => field.onChange(selected?.value)}
                value={transportistasOptions.find(
                  (option) => option.value === field.value
                )}
              />
            )}
          />
          {errors.carrier_id && <Error>{errors.carrier_id?.message?.toString()}</Error>}
        </div>


        <Button
          disabled={isPending}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {isPending ? (
            <Spinner />
          ) : (
            <p className="font-bold text-lg">Crear Piloto</p>
          )}
        </Button>
      </form>
    </>
  )
}
