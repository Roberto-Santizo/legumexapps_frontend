import { User } from "lucide-react";
import { Dispatch, useState } from "react";
import UserMenu from "./UserMenu";
import { useAppStore } from "../stores/useAppStore";
import { Bars3Icon } from "@heroicons/react/16/solid";

type Props = {
  setModal: Dispatch<React.SetStateAction<boolean>>
}

export function Header({ setModal }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const AuthUser = useAppStore((state) => state.AuthUser);

  return (
    <header className="flex items-center justify-end py-5">

      {open && <UserMenu setOpen={setOpen} />}

      <div className="flex space-x-4">
        <div className="flex gap-5 mr-12">
          <p className="font-bold">Hola: {AuthUser.name}</p>
          <User className="hover:text-gray-300 cursor-pointer" onClick={() => setOpen(true)} />
          <Bars3Icon className="hover:text-gray-300 cursor-pointer block w-6 md:hidden" onClick={() => setModal(true)} />
        </div>
      </div>
    </header>
  );
}
