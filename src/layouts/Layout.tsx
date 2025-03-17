import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import MobileSidebar from "@/components/MobileSidebar";
import { useAppStore } from "@/stores/useAppStore";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/Spinner";

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
    </>
  );
}
