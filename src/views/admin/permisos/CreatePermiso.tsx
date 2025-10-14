import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createPermission } from "@/api/PermissionsAPI";
import { useMutation } from "@tanstack/react-query";
import { DraftPermiso } from "@/types/permissionsType";
import { useNotification } from "../../../core/notifications/NotificationContext";
import Spinner from "@/components/utilities-components/Spinner";
import PermisosForm from "./PermisosForm";


export default function CreatePermiso() {
  const navigate = useNavigate();
  const notify = useNotification();

  const { mutate, isPending } = useMutation({
    mutationFn: createPermission,
    onError: (error) => {
      notify.error(error.message)
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      navigate("/permisos");
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftPermiso>();

  const handleCreatePermission = async (data: DraftPermiso) => mutate(data);

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Permiso</h2>

      <div>
        <form
          className="mt-10 xl:w-3/4 mx-auto shadow-xl p-10 space-y-5"
          onSubmit={handleSubmit(handleCreatePermission)}
        >

          <PermisosForm register={register} errors={errors} />

          <button type="submit" disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
            {isPending ? <Spinner /> : <p>Crear Permiso</p>}
          </button>
        </form>
      </div>
    </>
  );
}
