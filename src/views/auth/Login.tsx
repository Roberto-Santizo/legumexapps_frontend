import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/AuthAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";

export type LoginType = {
  username: string,
  password: string,
}

export default function Login() {
  const navigate = useNavigate();
  const logedIn = localStorage.getItem('AUTH_TOKEN') ? true : false;

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<LoginType>();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      localStorage.setItem('AUTH_TOKEN', data);
      navigate("/dashboard");
    }
  });

  useEffect(() => {
    if (logedIn) {
      navigate("/dashboard");
    }
  }, [logedIn]);

  const OnSubmit = (data: LoginType) => mutate(data);

  return (
    <>
      <h2 className="font-bold text-3xl">Iniciar Sesión</h2>
      <form
        onSubmit={handleSubmit(OnSubmit)}
        className="space-y-8 p-10 bg-white mt-10 w-4/5 shadow border border-gray-200"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
          >Nombre de Usuario</label>

          <input
            id="username"
            type="username"
            placeholder="Nombre de usuario"
            className="w-full p-3  border-gray-300 border"
            {...register("username", {
              required: "El username es obligatorio",
            })}
            autoComplete="off"
          />

          {errors?.username && (
            <Error>{errors?.username.message}</Error>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Contraseña</label>

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              required: "La contraseña es obligatoria",
            })}
            autoComplete="off"
          />

          {errors?.password && (
            <Error>{errors?.password.message}</Error>
          )}
        </div>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Iniciar Sesión</p>}
        </button>
      </form>
    </>
  );
}

