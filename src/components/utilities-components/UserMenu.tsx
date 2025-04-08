import { XCircleIcon } from "@heroicons/react/16/solid";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { User2Icon } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import Spinner from "./Spinner";

type UserMobileProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UserMenu({ setOpen }: UserMobileProps) {

  const [loading,setLoading] = useState<boolean>(false);
  const logout = useAppStore((state) => state.logOut);
  const user = useAppStore((state) => state.AuthUser);

  const handleClick = async () => {
    setLoading(true);
    try {
      await logout();
      toast.success("Sesión cerrada correctamente")
    } catch (error) {
      toast.error("Hubo un error al cerrar sesión, intentelo de nuevo más tarde");
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="bg-opacity-70 fixed top-0 right-0 m-4 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md h-auto flex flex-col justify-between text-white rounded-lg shadow-lg p-10">
        <div className="flex justify-end text-black">
          <XCircleIcon
            className="w-5 hover:text-red-500 cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="flex flex-col gap-2 text-black">
          <div className="flex items-center gap-3 p-2">
            <User2Icon width={64} height={64}/>
            <div>
              <p className="text-lg text-black font-bold">{user.name}</p>
            </div>
          </div>

          <p className="text-lg">
            <span className="font-bold">Nombre de Usuario</span>:{" "}
            {user.username}
          </p>
          <p className="text-lg">
            <span className="font-bold">Correo: </span>
            {user.email ==='' ? 'SIN CORREO ASOCIADO' : user.email}
          </p>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-600 button mt-10"
          onClick={() => handleClick()}
        >
          {loading ? <Spinner /> : "Cerrar Sesión"}
        </button>
      </div>
    </div>
  );
}
