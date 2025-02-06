import { Bell, User } from "lucide-react";
import { useState } from "react";
import UserMenu from "./UserMenu";
import { useAppStore } from "../stores/useAppStore";

export function Header() {
  const [open,setOpen] = useState<boolean>(false);
  const AuthUser = useAppStore((state) => state.AuthUser);

  return (
    <header className="flex items-center justify-end py-5">
      
      {open && <UserMenu setOpen={setOpen}/>}
      
      <div className="flex space-x-4">
        <div className="flex gap-5 mr-12">
          <p className="font-bold">Hola: {AuthUser.name}</p>
          <Bell className="hover:text-gray-300 cursor-pointer" />
          <User className="hover:text-gray-300 cursor-pointer" onClick={() => setOpen(true)}/>
        </div>
      </div>
    </header>
  );
}
