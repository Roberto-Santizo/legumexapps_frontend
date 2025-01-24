import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useAppStore } from "../stores/useAppStore";
import Spinner from "./Spinner";

export default function PublicHeader() {
  const logedIn = useAppStore((state) => state.logedIn);
  const logOut = useAppStore((state) => state.logOut);
  const loadingAuth = useAppStore((state) => state.loadingAuth);

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
                onClick={() => logOut()}
                className="text-gray-500 font-bold uppercase"
              >
                {loadingAuth ? <Spinner /> : "Cerrar Sesión"}
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
