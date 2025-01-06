//HOOKS
import { useEffect } from "react";
import { useAppStore } from "../../../stores/useAppStore";
import { useParams } from "react-router-dom";

//COMPONENTES
import Spinner from "../../../components/Spinner";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import { Button } from "@mui/material";
import { DraftUser } from "../../../types";
import { useForm } from "react-hook-form";
import Error from "../../../components/Error";
import ReturnLink from "../../../components/utilities-components/ReturnLink";

export default function EditUser() {
  const { id } = useParams();
  const getUser = useAppStore((state) => state.getUser);
  const loadingUser = useAppStore((state) => state.loadingUser);
  const userError = useAppStore((state) => state.UserError);
  const userEditing = useAppStore((state) => state.userEditing);
  const UserErrors = useAppStore((state) => state.usersErrors);
  const fetRoles = useAppStore((state) => state.fetchRoles);
  const roles = useAppStore((state) => state.roles);

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
    }
  }, [userEditing, setValue]);

  useEffect(() => {
    if (id) {
      getUser(id);
      fetRoles();
    }
  }, []);

  const editUser = () => {
    console.log("editando");
  };

  return (
    <>
      {!loadingUser && !userError && (
        <div>
          <h2 className="text-4xl font-bold">
            Edición de Usuario: {userEditing.name}
          </h2>
          <ReturnLink url="/usuarios" />
        </div>
      )}

      {loadingUser && <Spinner />}
      {userError && <ShowErrorAPI />}

      {!loadingUser && !userError && (
        <form
          className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
          onSubmit={handleSubmit(editUser)}
        >
          {UserErrors
            ? UserErrors.map((error, index) => (
                <Error key={index}>{error}</Error>
              ))
            : null}
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
              {...register("password", {
                required: "El password es obligatorio",
              })}
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

            {errors.roles && <Error>{errors.roles?.message?.toString()}</Error>}
          </div>

          <Button
            disabled={loadingUser}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            {loadingUser ? (
              <Spinner />
            ) : (
              <p className="font-bold text-lg">Crear Usuario</p>
            )}
          </Button>
        </form>
      )}
    </>
  );
}
