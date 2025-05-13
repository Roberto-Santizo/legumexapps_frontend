import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

type Props = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: ReactNode
}

export default function Filters({ isOpen, setIsOpen, children }: Props) {
    return (
        <div className="relative">
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setIsOpen(false)}
            ></div>

            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? "0%" : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg z-50 p-4 flex flex-col"
            >
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-semibold">Filtros</h2>
                    <button onClick={() => setIsOpen(false)} className="p-2">
                        <X size={20} />
                    </button>
                </div>

                {children}

            </motion.div>
        </div>
    )
}
