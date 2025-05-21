import { XCircleIcon } from "@heroicons/react/16/solid";
import { Dispatch, SetStateAction } from "react";
import { User2Icon } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { logout } from "@/api/AuthAPI";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import Spinner from "./Spinner";

type UserMobileProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UserMenu({ setOpen }: UserMobileProps) {
  const user = useAppStore((state) => state.AuthUser);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      localStorage.removeItem('AUTH_TOKEN');
      localStorage.removeItem('AUTH_USER');
      toast.success(data);
      navigate("/login");
      window.location.reload;
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-4 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-6"
      >
        <div className="flex justify-end">
          <XCircleIcon
            className="w-6 h-6 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <User2Icon className="w-10 h-10 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.username}</p>
          </div>
        </div>

        <div className="space-y-2 text-gray-700 text-base">
          <p>
            <span className="font-semibold">Nombre de Usuario:</span> {user.username}
          </p>
          <p>
            <span className="font-semibold">Correo:</span>{' '}
            {user.email === '' ? 'SIN CORREO ASOCIADO' : user.email}
          </p>
        </div>

        <button
          disabled={isPending}
          onClick={() => mutate()}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition uppercase ${isPending
            ? 'bg-indigo-300 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {isPending ? <Spinner /> : 'Cerrar Sesión'}
        </button>
      </motion.div>
    </div>
  );
}
