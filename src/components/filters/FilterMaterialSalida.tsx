import { motion } from "framer-motion";
import { X } from "lucide-react";

interface FiltersReceptionsInsumosProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}
// type FilytFiltersMaterialSalidaer = {
//     reference: string;
//     responsable_bags: string;
//     responsable_boxes: string;
// }

// const initialValues: FilytFiltersMaterialSalidaer = {
//   reference: "",
//   responsable_bags: "",
//   responsable_boxes: "",
// };

export default function FilterMaterialSalida({ isOpen, setIsOpen }: FiltersReceptionsInsumosProps) {
    return (
        <div className="relative">
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>

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

                <div className="flex-1 overflow-y-auto max-h-screen p-2 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Factura</label>
                        <input type="text" name="invoice" className="w-full border p-2 rounded" placeholder="Numero de la factura"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Nombre del Receptor</label>
                        <input type="text" name="received_by" className="w-full border p-2 rounded" placeholder="Nombre del Receptor"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Fecha de Recepción</label>
                        <input type="date" name="invoice_date" className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Fecha de Factura</label>
                        <input type="date" name="invoice_date" className="w-full border p-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Item</label>
                    </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                    <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded"                    >
                        Filtrarññ
                    </button>

                    <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                    >
                        Borrar Filtros
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
