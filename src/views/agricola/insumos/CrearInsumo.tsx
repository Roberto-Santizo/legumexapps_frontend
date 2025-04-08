import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createInsumo, DraftInsumo } from "@/api/InsumosAPI";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";

export default function CrearInsumo() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createInsumo,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/insumos');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftInsumo>();

  const handleCreateInsumo = async (data: DraftInsumo) => mutate(data);

  return (
    <>
      <h2 className="font-bold text-4xl">Crear Insumo</h2>

      <form
        className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
        onSubmit={handleSubmit(handleCreateInsumo)}
      >
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="name">
            Nombre del Insumo:
          </label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder={"Nombre del insumo"}
            className="border border-black p-3"
            {...register("name", {
              required: "El nombre del insumo es obligatorio",
            })}
          />
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="code">
            Codigo del Insumo:
          </label>
          <input
            autoComplete="off"
            id="code"
            type="text"
            placeholder={"Codigo del insumo"}
            className="border border-black p-3"
            {...register("code", {
              required: "El codigo del insumo es obligatorio",
            })}
          />
          {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="measure">
            Unidad de Medida:
          </label>
          <input
            autoComplete="off"
            id="measure"
            type="text"
            placeholder={"Unidad de medida del Insumo"}
            className="border border-black p-3"
            {...register("measure", {
              required: "La unidad de madida del insumo es obligatoria",
            })}
          />
          {errors.measure && (
            <Error>{errors.measure?.message?.toString()}</Error>
          )}
        </div>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Insumo</p>}
        </button>
      </form>
    </>
  );
}
