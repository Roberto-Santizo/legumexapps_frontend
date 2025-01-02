import { useForm } from "react-hook-form";
import ReturnLink from "../../../components/utilities-components/ReturnLink";
import { roles, permissions } from "../../../data/data";
import Error from "../../../components/Error";
import { DraftUser } from "../../../types";

export default function CreateUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftUser>();

  const RegisterUser = (data: DraftUser) => {
    console.log(data);
  };

  return (
    <>
      <h2 className="text-4xl font-bold">Crear Usuario</h2>
      <ReturnLink url="/administracion/usuarios" />
      <form
        className="mt-10 w-2/3 mx-auto shadow p-10 space-y-5"
        onSubmit={handleSubmit(RegisterUser)}
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
              required: "El email es obligatorio",
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
            {...register("role", { required: "El rol es obligatorio" })}
          >
            <option value="">--SELECCIONE UNA OPCIÓN--</option>
            {roles.map((role) => (
              <option value={role.id} key={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          {errors.role && <Error>{errors.role?.message?.toString()}</Error>}
        </div>

        <fieldset className="shadow p-5">
          <legend className="text-3xl font-bold">Permisos</legend>
          <div className="flex flex-col gap-5">
            {permissions.map((permission) => (
              <div
                className="w-full flex flex-row gap-5 p-5 odd:bg-gray-300 odd:text-white shadow-xl"
                key={permission.id}
              >
                <input
                  type="checkbox"
                  id={permission.id}
                  value={permission.id}
                  {...register("permissions", {
                    required: "Selecciona al menos un permiso",
                  })}
                  className="w-10"
                />
                <label className="font-bold text-xl" htmlFor={permission.id}>
                  {permission.name}
                </label>
              </div>
            ))}
          </div>
          {errors.permissions && (
            <Error>{errors.permissions.message?.toString()}</Error>
          )}
        </fieldset>

        <input
          type="submit"
          value={"Guardar"}
          className="button bg-blue-500 hover:bg-blue-600 w-full"
        />
      </form>
    </>
  );
}
