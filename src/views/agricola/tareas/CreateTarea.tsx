import { createTarea } from "@/api/TasksAPI";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import TareasForm from "./TareasForm";
import { DraftTask } from "types/taskGeneralType";

export default function CreateTarea() {

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
        className="mt-10 w-3/4 mx-auto shadow-xl p-10 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >

        <TareasForm register={register} errors={errors} />

        <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Tarea</p>}
        </button>
      </form>
    </>
  );
}
