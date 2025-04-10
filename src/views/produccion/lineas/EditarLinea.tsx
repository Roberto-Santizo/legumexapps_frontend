import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLineaById, updateLinea } from "@/api/LineasAPI";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { DraftLinea } from "./CrearLinea";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import InputComponent from "@/components/form/InputComponent";

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
          className="mt-10 w-2/3 shadow-xl mx-auto p-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >

          <InputComponent<DraftLinea>
            label="Código"
            id="code"
            name="code"
            placeholder="Codificación de la línea"
            register={register}
            validation={{ required: 'La codificación de la linea es requerido' }}
            errors={errors}
            type={'text'}
          >
            {errors.code && <Error>{errors.code?.message?.toString()}</Error>}
          </InputComponent>

          <InputComponent<DraftLinea>
            label="Total de Personas"
            id="total_persons"
            name="total_persons"
            placeholder="Total de personas que conforman la linea"
            register={register}
            validation={{ required: 'El total de persona es obligatorio' }}
            errors={errors}
            type={'text'}
          >
            {errors.total_persons && <Error>{errors.total_persons?.message?.toString()}</Error>}
          </InputComponent>

          <button className="button w-full bg-indigo-500 hover:bg-indigo-600">
            {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
          </button>
        </form>
      </div>
    </>
  );
}
