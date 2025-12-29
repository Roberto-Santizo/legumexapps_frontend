import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@/core/notifications/NotificationContext";
import { createItemPackingMaterial } from "../api/api";
import { DraftMaterialEmpaque } from "../types/types";
import Spinner from "@/components/utilities-components/Spinner";
import Form from "./Form";



export default function Create() {
  const navigate = useNavigate();
  const notify = useNotification();

  const { mutate, isPending } = useMutation({
    mutationFn: createItemPackingMaterial,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      navigate('/material-empaque');
    }
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DraftMaterialEmpaque>();

  const onSubmit = (data: DraftMaterialEmpaque) => { mutate(data) };

  return (
    <>
      <h2 className="text-xl text-center xl:text-left xl:text-4xl font-bold">Crear Item Material de Empaque</h2>
      <form
        className="mt-10 xl:w-3/4 mx-auto shadow-xl p-10 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >

        <Form register={register} errors={errors} control={control}/>

        <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear</p>}
        </button>
      </form>
    </>
  );
}

