import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/AuthAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import InputComponent from "@/components/form/InputComponent";
import Spinner from "@/components/utilities-components/Spinner";
import Error from "@/components/utilities-components/Error";

export type LoginType = {
  username: string,
  password: string,
}

function Login() {
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
      localStorage.setItem('AUTH_TOKEN', data.token);
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
    <div className="shadow-xl p-10 border">
      <form onSubmit={handleSubmit(OnSubmit)} className="space-y-4">
        <InputComponent<LoginType>
          label="Nombre de usuario"
          id="username"
          name="username"
          placeholder="Nombre de usuario"
          register={register}
          validation={{ required: 'El nombre de usuario es requerido' }}
          errors={errors}
          type={"text"}
        >
          {errors.username && <Error>{errors.username?.message?.toString()}</Error>}
        </InputComponent>

        <InputComponent<LoginType>
          label="Contraseña"
          id="password"
          name="password"
          placeholder="Contraseña"
          register={register}
          validation={{ required: 'La contraseña es requerida' }}
          errors={errors}
          type={"password"}
        >
          {errors.password && <Error>{errors.password?.message?.toString()}</Error>}
        </InputComponent>

        <button disabled={isPending} className="button bg-indigo-500 hover:bg-indigo-600 w-full">
          {isPending ? <Spinner /> : <p>Iniciar Sesión</p>}
        </button>
      </form>
    </div>
  );
}

export default Login;
