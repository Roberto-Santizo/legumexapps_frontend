import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getTareaById, updateTarea } from "@/api/TasksAPI";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Spinner from "@/components/utilities-components/Spinner";
import TareasForm from "./TareasForm";
import { DraftTask } from "types/taskGeneralType";

export default function EditTarea() {
  const params = useParams();
  const id = params.id!!;
  const navigate = useNavigate();

  const { data: editingTarea, isLoading, isError } = useQuery({
    queryKey: ['getTareaById', id],
    queryFn: () => getTareaById(id)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateTarea,
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
    setValue,
  } = useForm<DraftTask>();

  useEffect(() => {
    if (editingTarea) {
      setValue("name", editingTarea.name || "");
      setValue("code", editingTarea.code || "");
      setValue("description", editingTarea.description || "");
    }
  }, [editingTarea, setValue]);


  const onSubmit = (data: DraftTask) => mutate({ id, FormData: data })

  if (isLoading) return <Spinner />;
  if (isError) return <ShowErrorAPI />;
  if (editingTarea) return (
    <>
      <h2 className="text-4xl font-bold">Editar Tarea {editingTarea.name}</h2>
      <div>
        <form
          className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TareasForm register={register} errors={errors} />

          <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
          </button>
        </form>
      </div>
    </>
  );
}
