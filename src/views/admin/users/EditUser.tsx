//HOOKS
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

//API
import { updateUser, getUser } from "@/api/UsersAPI";
import { getRoles } from "@/api/RolesAPI";
import { getPermissions } from "@/api/PermissionsAPI";

//TYPES
import { DraftUser, Permission, Role, UserDetail } from "@/types";

//COMPONENTES
import Spinner from "@/components/Spinner";
import { Button } from "@mui/material";
import Error from "@/components/Error";
import { toast } from "react-toastify";

export default function EditUser() {
  const { id } = useParams();
  const [loadingGetRoles, setLoadingGetRoles] = useState<boolean>(false);
  const [loadingGetPermissions, setLoadingGetPermissions] = useState<boolean>(false);
  const [loadingGetUser, setLoadingGetUser] = useState<boolean>(false);
  const [loadingUpdateUser, setLoadingUpdateUser] = useState<boolean>(false);

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [userEditing, setUserEditing] = useState<UserDetail>({} as UserDetail);

  const handleGetRoles = async () => {
    setLoadingGetRoles(true);
    try {
      const roles = await getRoles();
      setRoles(roles);
    } catch (error) {
      toast.error(
        "Hubo un error al traer los roles, intentelo de nuevo más tarde"
      );
    } finally {
      setLoadingGetRoles(false);
    }
  };

  const handleGetPermissions = async () => {
    setLoadingGetPermissions(true);
    try {
      const permssions = await getPermissions();
      setPermissions(permssions);
    } catch (error) {
      toast.error(
        "Hubo un error al traer los permisos, intentelo de nuevo más tarde"
      );
    } finally {
      setLoadingGetPermissions(false);
    }
  };

  const handleGetUser = async () => {
    setLoadingGetUser(true);
    try {
      if (id) {
        const user = await getUser(id);
        setUserEditing(user);
      }
    } catch (error) {
      toast.error("Hubo un error al traer el usuario, intentelo de nuevo más tarde");
    } finally {
      setLoadingGetUser(false);
    }
  }

  useEffect(() => {
    handleGetUser();
    handleGetPermissions();
    handleGetRoles();
  }, []);

  const navigate = useNavigate();

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

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

  const editUser = async (data: DraftUser) => {
    setLoadingUpdateUser(true);
    const updatedData = { ...data, permissions: selectedPermissions.map(id => ({ id, name: '' })) }
    if (id) {
      const errors = await updateUser(id, updatedData);
      console.log(errors);
      if (errors) {
        errors.forEach(error => toast.error(error[0]))
        setLoadingUpdateUser(false);
        return;
      }
      toast.success("Usuario actualizado correctamente");
      navigate("/usuarios");
    }
    setLoadingUpdateUser(false);
  };

  return (
    <>
      {!loadingGetUser && userEditing && (
        <div>
          <h2 className="text-4xl font-bold">
            Edición de Usuario: {userEditing.name}
          </h2>
        </div>
      )}

      {loadingGetUser && <Spinner />}

      {!loadingGetUser && userEditing && (
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

          {loadingGetRoles ? (
            <Spinner />
          ) : (
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
          )}

          {loadingGetPermissions ? (
            <Spinner />
          ) : (
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
          )}

          <Button
            disabled={loadingUpdateUser}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {loadingUpdateUser ? (
              <Spinner />
            ) : (
              <p className="font-bold text-lg">Actualizar Usuario</p>
            )}
          </Button>
        </form>
      )}
    </>
  );
}
