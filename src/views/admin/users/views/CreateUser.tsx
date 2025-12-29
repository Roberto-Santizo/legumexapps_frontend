import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createUser } from "@/views/admin/users/api";
import { useMutation } from "@tanstack/react-query";
import { DraftUser } from "@/views/admin/users/types";
import { useNotification } from "@/core/notifications/NotificationContext";
import Spinner from "@/components/utilities-components/Spinner";
import UsersForm from "../components/UsersForm";


export default function CreateUser() {
  const navigate = useNavigate();
  const notify = useNotification();

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onError: (error) => {
      notify.error(error.message);
    },
    onSuccess: (data) => {
      notify.success(data ?? '');
      navigate("/usuarios");
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftUser>();

  const onSubmit = async (data: DraftUser) => {
    const finalData = {
      ...data,
      permissions: Array.isArray(data.permissions)
        ? data.permissions
        : [data.permissions],
    };

    mutate(finalData);
  };

  return (
    <>
      <h2 className="text-2xl xl:text-4xl font-bold">Crear Usuario</h2>
      <form
        className="mt-10 w-full xl:w-3/4 mx-auto shadow-xl p-10 space-y-5 my-5"
        onSubmit={handleSubmit(onSubmit)}
      >

        <UsersForm register={register} errors={errors} />

        <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Crear Usuario</p>}
        </button>
      </form>
    </>
  );
}
