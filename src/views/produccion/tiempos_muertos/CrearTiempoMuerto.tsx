import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createTimeOut } from "@/api/TimeOutsAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormTiempoMuerto from "./FormTiempoMuerto";
import Spinner from "@/components/utilities-components/Spinner";

export type DraftTiempoMuerto = {
  name: string;
  hours: string;
}

export default function CrearTiempoMuerto() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createTimeOut,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success('Tiempo muerto creado correctamente');
      navigate('/tiempos-muertos');
    }
  });
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<DraftTiempoMuerto>();


  const onSubmit = (data: DraftTiempoMuerto) => mutate(data);

  return (
    <div>
      <h2 className="font-bold text-4xl">Crear Tiempo Muerto</h2>

      <form className="mx-auto w-1/2 mt-10 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormTiempoMuerto register={register} errors={errors} />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {isPending ? (
            <Spinner />
          ) : (
            <p className="font-bold text-lg">Crear Tiempo Muerto</p>
          )}
        </Button>
      </form>
    </div>
  )
}
