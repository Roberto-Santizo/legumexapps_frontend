import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/AuthAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Spinner from "@/components/utilities-components/Spinner";

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
      <div className="text-5xl font-black text-white text-center flex items-center justify-center">
        <img src="/LOGO_LX.png" alt="Img Logo" className="w-1/4" />
        <p className="flex-1">Iniciar Sesión</p>
      </div>

      <form
        onSubmit={handleSubmit(OnSubmit)}
        className="space-y-8 p-10 bg-white mt-10"
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
            <span className="border border-l-red-500 border-l-8 text-sm mt-1 bg-red-300 font-bold text-white p-2 uppercase">{errors?.username.message}</span>
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
            <span className="border border-l-red-500 border-l-8 text-sm mt-1 bg-red-300 font-bold text-white p-2 uppercase">{errors?.password.message}</span>
          )}
        </div>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Iniciar Sesión</p>}
        </button>
      </form>
    </>
  );
}

