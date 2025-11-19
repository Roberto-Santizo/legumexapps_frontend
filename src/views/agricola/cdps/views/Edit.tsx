import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom"
import { DraftCDP } from "../types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCdpById, updateCDP } from "../api/api";
import { useEffect } from "react";
import { useNotification } from "@/core/notifications/NotificationContext";
import Form from "../components/Form";
import Spinner from "@/components/utilities-components/Spinner";

export default function Edit() {
  const params = useParams();
  const notification = useNotification();
  const navigate = useNavigate();
  const id = params.id!;

  const { data, isLoading } = useQuery({
    queryKey: ['getCdpById', id],
    queryFn: () => getCdpById(id)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateCDP,
    onError: (error) => {
      notification.error(error.message);
    },
    onSuccess: (data) => {
      notification.success(data!);
      navigate('/cdps');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<DraftCDP>();

  const onSubmit = (data: DraftCDP) => mutate({ id, data });

  useEffect(() => {
    if (data) {
      setValue('name', data.name);
      setValue('start_date', data.start_date);
      setValue('end_date', data.end_date);
    }
  }, [data]);

  if (isLoading) return <Spinner />
  if (data) return (
    <div>
      <h2 className="text-xl text-center xl:text-left xl:text-4xl font-bold">Editar Control de Plantación</h2>


      <form className="space-y-5 xl:w-2/3 mx-auto p-10 mt-10 shadow-xl" onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} />

        <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
        </button>
      </form>
    </div>
  )
}
