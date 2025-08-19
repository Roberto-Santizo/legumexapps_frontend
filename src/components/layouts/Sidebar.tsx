import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store";
import { XIcon } from "lucide-react";
import Navegation from "../Navegation";


export function Sidebar() {
  const { logout } = useAuth();
  const changeSidebar = useAppStore((state) => state.changeSidebarState);
  const show = useAppStore((state) => state.isSidebarOpen);

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="h-screen w-72 bg-[#232232] shadow-lg z-[9999] fixed top-0 left-0 xl:static xl:z-auto"
        >
          <div className="space-y-4 py-4 max-h-screen overflow-y-auto scrollbar-hide">
            <div className="px-3 py-2">
              <div className="mb-2 px-4 text-xl text-white font-semibold tracking-tight flex justify-between">
                <p>
                  LegumexApps <span className="text-indigo-500 font-bold">Web</span>
                </p>
                <button className="block xl:hidden">
                  <XIcon onClick={() => changeSidebar()} />
                </button>
              </div>

              <nav className="gap-2 py-2 flex flex-col w-full text-white">
                <Navegation />
              </nav>

              <button
                onClick={() => logout()}
                className="mt-6 w-full rounded-lg bg-red-500 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
