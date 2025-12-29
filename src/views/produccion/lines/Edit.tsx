import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLineaById, updateLinea } from "@/api/LinesAPI";
import { useEffect } from "react";
import { DraftLinea } from "./Create";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import InputComponent from "@/components/form/InputComponent";
import { useNotification } from "../../../core/notifications/NotificationContext";

export default function Edit() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id!;
  const notify = useNotification();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getLineaById', id],
    queryFn: () => getLineaById(id)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: DraftLinea) => updateLinea(data, id),
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
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

          <button className="button w-full bg-indigo-500 hover:bg-indigo-600">
            {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
          </button>
        </form>
      </div>
    </>
  );
}
