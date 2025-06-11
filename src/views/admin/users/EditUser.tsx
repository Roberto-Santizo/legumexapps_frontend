import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getUserById, updateUser } from "@/api/UsersAPI";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DraftUser, User } from "types/usersTypes";
import Spinner from "@/components/utilities-components/Spinner";
import UsersForm from "./UsersForm";

export default function EditUser() {
  const params = useParams();
  const id = params.id!!;
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const navigate = useNavigate();

  const [userEditing, setUserEditing] = useState<User>({} as User);

  const { data, isLoading } = useQuery({
    queryKey: ['getUser', id],
    queryFn: () => getUserById(id)
  });

  useEffect(() => {
    if (data) {
      setUserEditing(data);
    }
  }, [data])

  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate('/usuarios');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DraftUser>();

  useEffect(() => {
    if (userEditing) {
      setValue("name", userEditing.name || "");
      setValue("username", userEditing.username || "");
      setValue("email", userEditing.email || "");
      setValue("role", userEditing.role || "");

      if (userEditing?.permissions) {
        const permisosIds = userEditing.permissions.map((permiso) => permiso.id.toString());
        setSelectedPermissions(permisosIds);
        setValue("permissions", permisosIds);
      }
    }
  }, [userEditing, setValue]);

  const onSubmit = async (data: DraftUser) => {
    const FormData = {
      ...data,
      permissions: Array.isArray(data.permissions)
        ? data.permissions
        : [data.permissions],
    };

    mutate({ id, user: FormData });
  };

  if (isLoading) return <Spinner />
  if (selectedPermissions) return (
    <>
      <div>
        <h2 className="text-4xl font-bold">
          Edición de Usuario: {userEditing.name}
        </h2>
      </div>
      <form
        className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <UsersForm register={register} errors={errors} setSelectedPermissions={setSelectedPermissions} isEditing={true} />

        <button className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Guardar Cambios</p>}
        </button>
      </form>
    </>
  );
}
