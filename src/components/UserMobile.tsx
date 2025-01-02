import { XCircleIcon } from "@heroicons/react/16/solid";
import { Dispatch, SetStateAction } from "react";

type UserMobileProps = {
    setOpen: Dispatch<SetStateAction<boolean>> 
}

export default function UserMobile({setOpen} : UserMobileProps) {
  return (
    <div className="bg-opacity-70 fixed top-0 right-0 m-4 flex justify-center items-center z-50">
      <div className="bg-gray-400 w-full max-w-md h-auto flex flex-col justify-between text-white rounded-lg shadow-lg p-10 gap-10">
        <div className="flex justify-between">
            <div>
                <img src="../LOGO_LX.png" alt="Imagen Logo" className="w-12" />
                <p>Agroindustria Legumex</p>
            </div>
            <XCircleIcon className="w-5 hover:text-gray-500 cursor-pointer" onClick={() => setOpen(false)}/>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-lg">Roberto Santizo</p>
          <p className="text-lg"><span className="font-bold">Nombre de Usuario</span>: admin</p>
          <p className="text-lg"><span className="font-bold">Correo: </span>correo@correo.com</p>
        </div>

        <button className="bg-orange-500 hover:bg-orange-600 button">
            Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
