import { motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { Dispatch } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navegation from "../Navegation";

type Props = {
    modal: boolean;
    setModal: Dispatch<React.SetStateAction<boolean>>;
};

export default function MobileSidebar({ modal, setModal }: Props) {
    const { logout } = useAuth();
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
                                <Navegation />
                            </nav>
                            <button className="button bg-indigo-500 hover:bg-indigo-600 w-full mt-2" onClick={() => logout()}>
                                <p>Cerrar Sesión</p>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
