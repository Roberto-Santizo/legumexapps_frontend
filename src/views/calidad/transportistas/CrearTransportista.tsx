import Error from "@/components/utilities-components/Error";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@mui/material";
import Spinner from "@/components/utilities-components/Spinner";
import { createTransportista, DraftTransportista } from "@/api/TransportistasAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CrearTransportista() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createTransportista,
    onError: () => {
      toast.error('Hubo un error al crear el transportista');
    },
    onSuccess: () => {
      toast.success('Transportista creado correctamente');
      navigate('/transportistas');
    }

  });

  const {
    handleSubmit,
    formState:{errors},
    register
  } = useForm<DraftTransportista>();

  const onSubmit = (data : DraftTransportista) => mutate(data)
  return (
    <>
      <h1 className="text-3xl font-bold">Crear Transportista</h1>

      <form className="w-1/2 mx-auto mt-10 space-y-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="name">
            Codigo del Transportista:
          </label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder={"Codigo del Transportista"}
            className="border border-black p-3"
            {...register("code", {
              required: "El codigo del transportista es obligatorio",
            })}
          />
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="name">
            Nombre del Transportista:
          </label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder={"Nombre del Transportista"}
            className="border border-black p-3"
            {...register("name", {
              required: "El nombre del insumo es obligatorio",
            })}
          />
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
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
            <p className="font-bold text-lg">Crear Transportista</p>
          )}
        </Button>
      </form>
    </>
  )
}
