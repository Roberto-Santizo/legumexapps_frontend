import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateUser, getUser } from "@/api/UsersAPI";
import { getRoles } from "@/api/RolesAPI";
import { getPermissions } from "@/api/PermissionsAPI";
import { DraftUser, Permission, Role, UserDetail } from "@/types";
import Spinner from "@/components/Spinner";
import { Button } from "@mui/material";
import Error from "@/components/Error";
import { toast } from "react-toastify";
import { useQueries,useMutation } from "@tanstack/react-query";

export default function EditUser() {
  const params = useParams();
  const id = params.id!!;
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [userEditing, setUserEditing] = useState<UserDetail>({} as UserDetail);

  const results = useQueries({
    queries: [
      { queryKey: ['getRoles'], queryFn: getRoles },
      { queryKey: ['getPermissions'], queryFn: getPermissions },
      { queryKey: ['getUser', id], queryFn: () => getUser(id) }
    ]
  });

  const isLoading = results.some(result => result.isFetching);

  useEffect(() => {
    if (results[0].data) setRoles(results[0].data)
    if (results[1].data) setPermissions(results[1].data)
    if (results[2].data) setUserEditing(results[2].data)
  }, [results])

  const {mutate,isPending} = useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: DraftUser }) => updateUser(id, updatedData),
    onError: () => {
      toast.error('Hubo un error al actualizar el usuario');
    },
    onSuccess: () => {
      toast.success('Usuario actualizado Correctamente');
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
      setValue("roles", userEditing.roles || "");

      if (userEditing?.permissions) {
        setSelectedPermissions(
          userEditing.permissions.map((permiso) => permiso.id)
        );
      }
    }
  }, [userEditing, setValue]);

  const handleCheckboxChange = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );

  };

  const editUser = async (data: DraftUser) => mutate({id, updatedData: data});


  if (isLoading) return <Spinner />
  return (
    <>
      <div>
        <h2 className="text-4xl font-bold">
          Edición de Usuario: {userEditing.name}
        </h2>
      </div>
      <form
        className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
        onSubmit={handleSubmit(editUser)}
      >
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="name">
            Nombre:
          </label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder={"Nombre del usuario"}
            className="border border-black p-3"
            {...register("name", { required: "El nombre es obligatorio" })}
          />
          {errors.name && <Error>{errors.name?.message?.toString()}</Error>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="username">
            Username:
          </label>
          <input
            autoComplete="off"
            id="username"
            type="text"
            placeholder={"Nombre del usuario"}
            className="border border-black p-3"
            {...register("username", {
              required: "El username es obligatorio",
              maxLength: {
                value: 16,
                message: "El username no puede tener más de 16 caracteres",
              },
            })}
          />
          {errors.username && (
            <Error>{errors.username?.message?.toString()}</Error>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="username">
            Email (Opcional):
          </label>
          <input
            autoComplete="off"
            id="email"
            type="email"
            placeholder={"Correo Electronico"}
            className="border border-black p-3"
            {...register("email", {
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "El formato del email es inválido",
              },
            })}
          />
          {errors.email && <Error>{errors.email?.message?.toString()}</Error>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="password">
            Contraseña:
          </label>
          <input
            autoComplete="off"
            id="password"
            type="password"
            placeholder={"Contraseña"}
            className="border border-black p-3"
            {...register("password")}
          />
          {errors.password && (
            <Error>{errors.password?.message?.toString()}</Error>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase" htmlFor="role">
            Rol:
          </label>

          <select
            id="role"
            className="border border-black p-3"
            {...register("roles", { required: "El rol es obligatorio" })}
          >
            <option value="">--SELECCIONE UNA OPCIÓN--</option>
            {roles.map((role) => (
              <option value={role.name} key={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          {errors.roles && (
            <Error>{errors.roles?.message?.toString()}</Error>
          )}
        </div>

        <fieldset className="shadow p-5">
          <legend className="text-3xl font-bold">Permisos</legend>
          {errors.permissions && (
            <Error>{errors.permissions.message?.toString()}</Error>
          )}
          <div className="flex flex-col gap-5 mt-5">
            {permissions.map((permission) => (
              <div
                className="w-full flex flex-row gap-5 p-5 odd:bg-gray-300 odd:text-white shadow-xl"
                key={permission.id}
              >
                <input
                  type="checkbox"
                  id={permission.name}
                  value={permission.id}
                  {...register("permissions", {
                    required: "Selecciona al menos un permiso",
                  })}
                  className="w-10"
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={() => handleCheckboxChange(permission.id)}
                />
                <label
                  className="font-bold text-xl"
                  htmlFor={permission.name}
                >
                  {permission.name}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <Button
          disabled={isPending}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          {isPending ? (
            <Spinner />
          ) : (
            <p className="font-bold text-lg">Actualizar Usuario</p>
          )}
        </Button>
      </form>
    </>
  );
}
