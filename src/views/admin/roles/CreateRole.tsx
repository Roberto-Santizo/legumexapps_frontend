import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createRole } from "@/api/RolesAPI";
import { useMutation } from "@tanstack/react-query";
import { DraftRole } from "@/types/rolesTypes";
import Spinner from "@/components/utilities-components/Spinner";
import RolesForm from "./RolesForm";

export default function CreateRole() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createRole,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate("/roles");
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftRole>();

  const handleCreateRole = async (data: DraftRole) => mutate(data);

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Rol</h2>

      <div>
        <form
          className="mt-10 xl:w-3/4 mx-auto shadow-xl p-10 space-y-5"
          onSubmit={handleSubmit(handleCreateRole)}
        >

          <RolesForm register={register} errors={errors} />

          <button type="submit" disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Crear Rol</p>}
          </button>
        </form>
      </div>
    </>
  );
}
