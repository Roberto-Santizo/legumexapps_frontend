import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layouts/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Menu } from "lucide-react";
import MobileSidebar from "@/components/layouts/MobileSidebar";
import Spinner from "@/components/utilities-components/Spinner";

export default function Layout() {
  const [modal, setModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const { isLoading, isError } = useAuth();

  if (isLoading) return <Spinner />
  if (isError) {
    return <Navigate to={'/'} />
  }

  return (
    <>
      <div className="flex h-screen">
        <Sidebar show={showSidebar} setShowSidebar={setShowSidebar}/>

        {modal && (
          <MobileSidebar modal={modal} setModal={setModal} />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white scrollbar-hide">
            <div className="p-10">
              <Menu className="w-12 h-12 hover:text-gray-500 cursor-pointer" onClick={() => setShowSidebar(!showSidebar)} />
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
