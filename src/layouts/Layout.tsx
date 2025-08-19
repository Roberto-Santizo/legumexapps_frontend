import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layouts/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Menu, PaperclipIcon } from "lucide-react";
import { useAppStore } from "@/store";
import Spinner from "@/components/utilities-components/Spinner";

export default function Layout() {
  const changeSidebar = useAppStore((state) => state.changeSidebarState);
  const setIsStatic = useAppStore((state) => state.setIsStatic);
  const isStatic = useAppStore((state) => state.isStatic);
  const { isLoading, isError } = useAuth();

  if (isLoading) return <Spinner />
  if (isError) {
    return <Navigate to={'/'} />
  }

  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white scrollbar-hide">
            <div className="p-10">
              <div className="flex items-center gap-4 px-3 py-2 rounded-xl bg-white shadow-sm border border-gray-200">
                <Menu
                  className="w-10 h-10 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                  onClick={() => changeSidebar()}
                />

                <PaperclipIcon
                  className="w-6 h-6 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer hidden xl:block"
                  onClick={() => setIsStatic()}
                />

                {isStatic && (
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                    Navegación estática
                  </span>
                )}
              </div>

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
