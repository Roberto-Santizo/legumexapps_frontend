import { XCircleIcon } from "@heroicons/react/16/solid";
import { Dispatch, SetStateAction } from "react";
import { useAppStore } from "../stores/useAppStore";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

type UserMobileProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UserMobile({ setOpen }: UserMobileProps) {
  const user = useAppStore((state) => state.AuthUser);
  const logout = useAppStore((state) => state.logOut);
  const loadingAuth = useAppStore((state) => state.loadingAuth);
  const handleClick = ()=> {
    logout().then(() => toast.success("Sesión cerrada correctamente"));
  }
  return (
    <div className="bg-opacity-70 fixed top-0 right-0 m-4 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md h-auto flex flex-col justify-between text-white rounded-lg shadow-lg p-10 gap-10">
        <div className="flex justify-between text-black">
          <img src="../LOGO_LX.png" alt="Imagen Logo" className="w-24" />
          <XCircleIcon
            className="w-5 hover:text-red-500 cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="flex flex-col gap-2 text-black">
          <p className="text-lg text-black font-bold">{user.name}</p>
          <p className="text-lg">
            <span className="font-bold">Nombre de Usuario</span>:{" "}
            {user.username}
          </p>
          <p className="text-lg">
            <span className="font-bold">Correo: </span>
            {user.email}
          </p>
        </div>

        <button className="bg-orange-500 hover:bg-orange-600 button" onClick={() => handleClick()}>
           {loadingAuth ? <Spinner /> : "Cerrar Sesión"}
        </button>
      </div>
    </div>
  );
}
