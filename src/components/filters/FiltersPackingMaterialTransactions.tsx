import { FiltersPackingMaterialsTransactionInitialValues, FiltersPackingMaterialsTransactionType } from "@/views/bodega/transacciones-matrial-empaque/IndexPackingMaterialTransaction";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setTempFilters: Dispatch<SetStateAction<FiltersPackingMaterialsTransactionType>>;
    setFilters: Dispatch<SetStateAction<FiltersPackingMaterialsTransactionType>>;
    tempFilters: FiltersPackingMaterialsTransactionType;
    filters: FiltersPackingMaterialsTransactionType;
}

export default function FiltersPackingMaterialTransactions({ isOpen, setIsOpen, setTempFilters, setFilters, tempFilters, filters }: Props) {

    const handleFilterTempChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTempFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilterData = () => {
        setFilters(tempFilters);
        setIsOpen(false);
    };

    const handleResetFilters = () => {
        setFilters(FiltersPackingMaterialsTransactionInitialValues);
        setIsOpen(false);
    };

    useEffect(() => {
        setTempFilters(filters);
    }, [filters]);


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
                        <label className="block text-sm font-medium">Transferencia</label>
                        <input type="text" name="transaction_id" className="w-full border p-2 rounded" placeholder="Referencia de transferencia"
                            onChange={handleFilterTempChange} value={tempFilters.transaction_id || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Responsable</label>
                        <input type="text" name="responsable" className="w-full border p-2 rounded" placeholder="Nombre del Responsable"
                            onChange={handleFilterTempChange} value={tempFilters.responsable || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Entregado Por</label>
                        <input type="text" name="delivered_by" className="w-full border p-2 rounded" placeholder="Nombre del responsable bodega"
                            onChange={handleFilterTempChange} value={tempFilters.delivered_by || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Fecha de entrega</label>
                        <input type="date" name="delivered_date" className="w-full border p-2 rounded"
                            onChange={handleFilterTempChange} value={tempFilters.delivered_date || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Fecha de entrega</label>
                        <select name="type" className="w-full border p-2 rounded" onChange={handleFilterTempChange} value={tempFilters.type || ""}>
                            <option value="">--SELECCIONE UNA OPCIÓN--</option>
                            <option value="1">Salida</option>
                            <option value="2">Devolución</option>
                        </select>
                    </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                    <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded"
                        onClick={handleFilterData}
                    >
                        Filtrar
                    </button>

                    <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                        onClick={handleResetFilters}
                    >
                        Borrar Filtros
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
