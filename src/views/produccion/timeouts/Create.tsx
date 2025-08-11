import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createTimeOut } from "@/api/TimeOutsAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormTiempoMuerto from "./Form";
import Spinner from "@/components/utilities-components/Spinner";

export type DraftTiempoMuerto = {
  name: string;
  hours: string;
}

export default function Create() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createTimeOut,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
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

      <form className="mx-auto xl:w-2/3 shadow-xl p-10 mt-10 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormTiempoMuerto register={register} errors={errors} />

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Tiempo Muerto</p>}
        </button>
      </form>
    </div>
  )
}
