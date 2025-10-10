import { createTarea } from "@/api/TasksAPI";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { DraftTask } from "@/types/taskGeneralType";
import Spinner from "@/components/utilities-components/Spinner";
import Form from "./Form";

export default function Create() {

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createTarea,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/tareas');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftTask>();

  const onSubmit = (data: DraftTask) => { mutate(data) };

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Tarea</h2>
      <form
        className="mt-10 xl:w-3/4 mx-auto shadow-xl p-10 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >

        <Form register={register} errors={errors} />

        <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Tarea</p>}
        </button>
      </form>
    </>
  );
}
