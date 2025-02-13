// EXTERNAS
import { useState } from "react";
import { Outlet } from "react-router-dom";

// HOOKS
import UserMobile from "../components/UserMenu";

// COMPONENTES
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import ModalTomaLibras from "../components/ModalTomaLibras";
import InsumosModal from "../components/InsumosModal";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

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

      <ModalTomaLibras />
      <InsumosModal />

      {/* Menú móvil */}
      {open && <UserMobile setOpen={setOpen} />}
    </>
  );
}
