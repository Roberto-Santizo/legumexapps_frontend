import { useState } from "react";
import { Outlet } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import Logo from "../components/Logo";
import AdminNavegation from "../components/menus-navegations/AdminNavegation";
import UserMobile from "../components/UserMobile";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="header flex flex-row h-24 justify-between bg-gray-400  p-5 text-white w-full fixed top-0 left-0 z-10 items-center">
        <div className="w-32 flex flex-row">
          <Logo />
          <div className="flex flex-row gap-5 justify-center items-center"></div>
        </div>
        <div className="flex justify-center items-center gap-5">
          <p className="text-xl font-bold">Hola: Nombre de Usuario</p>
          <UserCircleIcon
            className="w-12 hover:text-gray-200 cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </div>
      </header>

      <div className="md:flex md:flex-row flex-1 pt-24">
        <aside className="pb-32 hidden h-full w-32 bg-gray-400  text-white md:flex flex-col items-center fixed top-24 scroll-container z-20">
          <AdminNavegation />
        </aside>

        <main className="mx-auto p-10 w-full md:ml-32">  
          <h1 className="text-2xl font-bold md:text-4xl">
            Dashboard Administración
          </h1>
          <Outlet />
        </main>
      </div>

      {open && <UserMobile setOpen={setOpen} />}
    </>
  );
}
