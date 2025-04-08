import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../components/layouts/Header";
import { useAppStore } from "@/stores/useAppStore";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/utilities-components/Spinner";
import { Sidebar } from "@/components/layouts/Sidebar";
import MobileSidebar from "@/components/layouts/MobileSidebar";

export default function Layout() {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);

  const { data: role, isLoading, isError } = useQuery({
    queryKey: ['getUserRoleByToken'],
    queryFn: getUserRoleByToken
  });

  if (isError) navigate('/login');
  if (isLoading) return <Spinner />
  if (role) return (
    <>
      <div className="flex h-screen bg-gray-100">
        <div className="hidden lg:block">
          <Sidebar role={role} />
        </div>

        {modal && (
          <MobileSidebar role={role} modal={modal} setModal={setModal} />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header setModal={setModal} />
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
