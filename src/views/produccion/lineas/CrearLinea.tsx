import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import Error from "@/components/Error";
import { createLinea } from "@/api/LineasAPI";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export type DraftLinea = {
  code: string;
  total_persons: number;
  shift: string;
  name: string;
}

export default function CreateSKU() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createLinea,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/lineas');
    }
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftLinea>();

  const onSubmit = (data: DraftLinea) => mutate(data)

  return (
    <>
      <h2 className="text-4xl font-bold">Crear línea</h2>

      <div>
        <form
          className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="code">
              Código:
            </label>
            <input
              autoComplete="off"
              id="code"
              type="text"
              placeholder="Codificación de la línea"
              className="border border-black p-3"
              {...register("code", { required: "La codificación de la línea es obligatoria" })}
            />
            {errors.code?.message && <Error>{String(errors.code.message)}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="name">
              Nombre de la Linea:
            </label>
            <input
              autoComplete="off"
              id="name"
              type="text"
              placeholder="Nombre de la linea"
              className="border border-black p-3"
              {...register("name", { required: "El nombre de la linea es obligatoria" })}
            />
            {errors.name?.message && <Error>{String(errors.name.message)}</Error>}
          </div>


          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="total_persons">
              Total de personas:
            </label>
            <input
              autoComplete="off"
              id="total_persons"
              type="number"
              placeholder="Ingrese el total de personas"
              className="border border-black p-3"
              {...register("total_persons", { required: "El total de personas es obligatorio" })}
            />
            {errors.total_persons?.message && <Error>{String(errors.total_persons.message)}</Error>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold uppercase" htmlFor="total_persons">
              Turno:
            </label>
            <select className="p-2 border border-black"
              {...register("shift", { required: 'El turno es requerido' })}
            >
              <option value="" disabled selected>--SELECCIONE UNA OPCIÓN--</option>
              <option value="1">AM</option>
              <option value="2">PM</option>
            </select>
            {errors.shift?.message && <Error>{String(errors.shift.message)}</Error>}
          </div>

          <button disabled={isPending} className="button w-full bg-indigo-500 hover:bg-indigo-600">
              {isPending ? <Spinner /> : <p>Crear Linea</p>}
          </button>
        </form>
      </div>
    </>
  );
}
