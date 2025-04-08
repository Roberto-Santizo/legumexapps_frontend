import Error from "@/components/utilities-components/Error";
import { Controller, useForm } from "react-hook-form"
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { getAllTransportistas, Transportista } from "@/api/TransportistasAPI";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import { useEffect, useState } from "react";
import { createPiloto, DraftPiloto } from "@/api/PilotosAPI";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CrearPiloto() {

  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey:['getAllTransportistas'],
    queryFn: getAllTransportistas
  });

  useEffect(()=>{
    if(data){
      setTransportistas(data);
    }
  },[data]);

  const transportistasOptions = transportistas.map((transportista) => ({
    value: transportista.id,
    label: `${transportista.code} - ${transportista.name}`,
  }));

  const { mutate, isPending } = useMutation({
    mutationFn: createPiloto,
    onError: () => {
      toast.error('Hubo un error al crear el piloto');
    },
    onSuccess: () => {
      toast.success('Piloto creado correctamente');
      navigate('/transportistas/pilotos');
    }
  });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors }
  } = useForm<DraftPiloto>();

  const onSubmit = (data : DraftPiloto) => mutate(data)

  if(isLoading) return <Spinner />
  if(isError) return <ShowErrorAPI />
  return (
    <>
      <h1 className="font-bold text-3xl">Crear Piloto</h1>

      <form className="w-1/2 mx-auto mt-10 space-y-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="name">
            Nombre del piloto:
          </label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder={"Nombre del Piloto"}
            className="border border-black p-3"
            {...register("name", {
              required: "El nombre del piloto",
            })}
          />
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="dpi">
            DPI del piloto:
          </label>
          <input
            autoComplete="off"
            id="dpi"
            type="text"
            placeholder={"DPI del Transportista"}
            className="border border-black p-3"
            {...register("dpi")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="license">
            Licencia del piloto:
          </label>
          <input
            autoComplete="off"
            id="license"
            type="text"
            placeholder={"Licencia del Transportista"}
            className="border border-black p-3"
            {...register("license")}
          />
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
