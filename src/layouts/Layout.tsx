// EXTERNAS
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

// HOOKS
import UserMobile from "../components/UserMenu";

// COMPONENTES
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { useAppStore } from "../stores/useAppStore";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const getUser = useAppStore((state) => state.getUserByToken);
  const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);

  useEffect(() => {
    getUserRoleByToken();
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar responsivo */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Contenedor Principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mt-4"></div>
              <div className="mt-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Menú móvil */}
      {open && <UserMobile setOpen={setOpen} />}
    </>
  );
}
