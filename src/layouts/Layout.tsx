import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layouts/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Bars3Icon } from "@heroicons/react/16/solid";
import MobileSidebar from "@/components/layouts/MobileSidebar";
import Spinner from "@/components/utilities-components/Spinner";

export default function Layout() {
  const [modal, setModal] = useState(false);
  const { isLoading, isError, logout } = useAuth();

  if (isLoading) return <Spinner />
  if (isError) {
    return <Navigate to={'/'} />
  }
  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <MobileSidebar modal={modal} setModal={setModal} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-end py-5">
            <div className="flex space-x-4">
              <div className="flex gap-5 mr-12 justify-center items-center">
                <Bars3Icon className="hover:text-gray-300 cursor-pointer block w-6 md:hidden" onClick={() => setModal(true)} />
                <button className="button bg-indigo-500 hover:bg-indigo-600 md:block hidden" onClick={() => logout()}>
                  <p>Cerrar Sesión</p>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white scrollbar-hide">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mt-4"></div>
              <div className="mt-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
