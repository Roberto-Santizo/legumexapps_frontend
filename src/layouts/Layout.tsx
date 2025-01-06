//EXTERNAS
import { useState } from "react";
import { Outlet } from "react-router-dom";

//HOOKS
import UserMobile from "../components/UserMenu";

//COMPONENTES
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900">
            <div className="container ml-10">
              <div className="mt-4"></div>
              <div className="mt-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>

      {open && <UserMobile setOpen={setOpen} />}
    </>
  );
}
