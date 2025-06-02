import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "@/api/AuthAPI";
import { useMutation } from "@tanstack/react-query";
import Logo from "../logos/Logo";
import Spinner from "../utilities-components/Spinner";

export default function PublicHeader() {
  const navigate = useNavigate();
  const logedIn = localStorage.getItem('AUTH_TOKEN') ? true : false;

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      localStorage.removeItem('AUTH_TOKEN');
      localStorage.removeItem('AUTH_USER');
      navigate("/login");
      toast.success(data);
    },
  });
  return (
    <header className="p-5 border-b bg-white shadow">
      <div className="container mx-auto flex justify-between">
        <Logo />

        <div className="flex flex-row gap-5 items-center justify-center">
          {logedIn ? (
            <div className="flex gap-2">
              <Link
                to={"/dashboard"}
                className="text-gray-500 font-bold uppercase"
              >
                Adminsistración
              </Link>
              <button
                onClick={() => mutate()}
                disabled={isPending}
                className="text-gray-500 font-bold uppercase"
              >
                {isPending ? <Spinner /> : "Cerrar Sesión"}
              </button>
            </div>
          ) : (
            <Link to={"/login"} className="text-gray-500 font-bold uppercase">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
