import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createCDP } from "../api/api";
import { useNotification } from "@/core/notifications/NotificationContext";
import { DraftCDP } from "../types/types";
import Spinner from "@/components/utilities-components/Spinner";
import Form from "../components/Form";

export default function Create() {
  const navigate = useNavigate();
  const notify = useNotification();

  const { mutate, isPending } = useMutation({
    mutationFn: createCDP,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      navigate('/cdps');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftCDP>();

  const handleCreateCDP = async (data: DraftCDP) => mutate(data);

  return (
    <>
      <h2 className="text-xl text-center xl:text-left xl:text-4xl font-bold">Crear Control de Plantación</h2>

      <form
        action=""
        className="space-y-5 xl:w-2/3 mx-auto p-5 mt-10"
        onSubmit={handleSubmit(handleCreateCDP)}
        noValidate
      >
        <Form register={register} errors={errors}/>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear CDP</p>}
        </button>
      </form>
    </>
  );
}
