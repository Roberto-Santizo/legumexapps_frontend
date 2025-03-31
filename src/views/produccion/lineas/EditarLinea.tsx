import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLineaById, updateLinea } from "@/api/LineasAPI";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { DraftLinea } from "./CrearLinea";
import Spinner from "@/components/Spinner";
import Error from "@/components/Error";
import ShowErrorAPI from "@/components/ShowErrorAPI";

export default function EditarLinea() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id!!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getLineaById', id],
    queryFn: () => getLineaById(id)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: DraftLinea) => updateLinea(data, id),
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
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<DraftLinea>();

  useEffect(() => {
    if (data) {
      setValue('code', data.code);
      setValue('total_persons', data.total_persons);
    }
  }, [data]);

  const onSubmit = (data: DraftLinea) => mutate(data);

  if (isLoading) return <Spinner />
  if (isError) return <ShowErrorAPI />
  return (
    <>
      <h2 className="text-3xl font-bold mb-5">Editar Linea</h2>
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

          <button className="button w-full bg-indigo-500 hover:bg-indigo-600">
            {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
          </button>
        </form>
      </div>
    </>
  );
}
