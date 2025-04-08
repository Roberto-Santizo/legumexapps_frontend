import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { HomeIcon, XIcon } from "lucide-react";
import { Dispatch } from "react";
import AdminNavegation from "../menus-navegations/AdminNavegation";
import AgricolaNavegation from "../menus-navegations/AgricolaNavegation";
import BoletaRMPNavigation from "../menus-navegations/BoletaRMPNavigation";

type Props = {
    role: string;
    modal: boolean;
    setModal: Dispatch<React.SetStateAction<boolean>>;
};

export default function MobileSidebar({ role, modal, setModal }: Props) {
    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${modal ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={() => setModal(false)}
            />

            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: modal ? 0 : "-100%" }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50 transition-transform"
            >
                <button
                    onClick={() => setModal(false)}
                    className="absolute top-4 right-4 p-2 bg-gray-200 rounded-lg"
                >
                    <XIcon className="w-6 h-6" />
                </button>

                <div className="pb-12 h-full overflow-y-auto">
                    <div className="space-y-4 py-4">
                        <div className="px-3 py-2">
                            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
                                Menu
                            </h2>
                            <nav className="gap-2 py-2 flex flex-col w-full">
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 rounded transition-colors w-full p-2 ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                                        }`
                                    }
                                >
                                    <HomeIcon className="w-6" />
                                    <p className="text-sm font-bold">Dashboard</p>
                                </NavLink>

                                {["admin"].includes(role) && (
                                    <>
                                        <AdminNavegation />
                                        <AgricolaNavegation role={role} />
                                        <BoletaRMPNavigation role={role} />
                                    </>
                                )}

                                {["auxagricola", "adminagricola"].includes(role) && (
                                    <AgricolaNavegation role={role} />
                                )}

                                {["pprod", "admincalidad", "auxcalidad", "pcostos", "pcalidad"].includes(role) && (
                                    <BoletaRMPNavigation role={role} />
                                )}
                            </nav>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
