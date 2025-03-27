import Error from "@/components/Error";
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/api/ClientsAPI";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { useNavigate } from "react-router-dom";

export type DraftClient = {
  name: string;
}

export default function CrearCliente() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createClient,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/clientes');
    }
  });
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<DraftClient>();

  const onSubmit = (data: DraftClient) => mutate(data);
  return (
    <div>
      <h2 className="font-bold text-4xl">Crear Cliente</h2>

      <form className="mt-10 w-2/3 mx-auto space-y-5 shadow-xl p-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="name">
            Nombre del Cliente:
          </label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder="Nombre del Cliente"
            className="border border-black p-3"
            {...register("name", { required: "El nombre del cliente es requerido" })}
          />
          {errors.name?.message && <Error>{String(errors.name.message)}</Error>}
        </div>

        <button type="submit" className="button w-full bg-indigo-500 hover:bg-indigo-600">
          {isPending ? <Spinner /> : <p>Crear Cliente</p>}
        </button>
      </form>
    </div>
  )
}
