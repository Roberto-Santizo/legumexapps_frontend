import { useAppStore } from "../stores/useAppStore";
import AdminNavegation from "./menus-navegations/AdminNavegation";
import AgricolaNavegation from "./menus-navegations/AgricolaNavegation";
import MantoNavegation from "./menus-navegations/MantoNavegation";

export function Sidebar() {
  const user = useAppStore((state) => state.AuthUser);
  return (
    <div className="pb-12 h-screen w-64 bg-gray-100 dark:bg-gray-800">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            Menu
          </h2>
          <div className="">
            {user.roles === "admin" && <AdminNavegation />}
            {(user.roles === "adminagricola" ||
              user.roles === "auxagricola") && <AgricolaNavegation />}
            {(user.roles === "adminmanto" || user.roles === "auxmanto") && (
              <MantoNavegation />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
