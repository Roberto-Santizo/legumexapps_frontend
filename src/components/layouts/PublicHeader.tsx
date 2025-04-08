import { Link } from "react-router-dom";
import { useAppStore } from "@/stores/useAppStore";
import { useState } from "react";
import { toast } from "react-toastify";
import Logo from "../logos/Logo";
import Spinner from "../utilities-components/Spinner";

export default function PublicHeader() {
  const logedIn = useAppStore((state) => state.logedIn);
  const [loading,setLoading] = useState<boolean>(false)
  const logOut = useAppStore((state) => state.logOut);

  const handleLogOut = async () => {
    setLoading(true);
    try {
      await logOut();
    } catch (error) {
      toast.error('Hubo un error');
    }finally{
      setLoading(false);
    }
  }

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
                onClick={() => handleLogOut()}
                className="text-gray-500 font-bold uppercase"
              >
                {loading ? <Spinner /> : "Cerrar Sesión"}
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
