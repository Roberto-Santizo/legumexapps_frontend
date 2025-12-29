import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createRole } from "@/views/admin/roles/api/api";
import { useMutation } from "@tanstack/react-query";
import { DraftRole } from "@/views/admin/roles/types";
import { useNotification } from "@/core/notifications/NotificationContext";
import Spinner from "@/components/utilities-components/Spinner";
import RolesForm from "../components/RolesForm";

export default function CreateRole() {
  const navigate = useNavigate();
  const notify = useNotification();

  const { mutate, isPending } = useMutation({
    mutationFn: createRole,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
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
