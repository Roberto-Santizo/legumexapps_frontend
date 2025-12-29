import { FiltersPackingMaterialsTransactionInitialValues } from "@/views/bodega/transactions/views/Index";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiltersPackingMaterialsTransactionType } from "../types/types";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setFilters: Dispatch<SetStateAction<FiltersPackingMaterialsTransactionType>>;
    filters: FiltersPackingMaterialsTransactionType;
}

export default function FiltersPackingMaterialTransactions({ isOpen, setIsOpen, setFilters, filters }: Props) {

    const [searchParams, setSearchParams] = useSearchParams();

    const handleFiltroChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        const filters = {
            'transaction_id': searchParams.get('transaction_id') ?? '',
            'responsable': searchParams.get('responsable') ?? '',
            'delivered_by': searchParams.get('delivered_by') ?? '',
            'delivered_date': searchParams.get('delivered_date') ?? '',
            'type': searchParams.get('type') ?? '',
            'sku': searchParams.get('sku') ?? '',
        }

        setFilters(filters);
    }, [searchParams]);

    const handleClearFilters = () => {
        setSearchParams({});
        setFilters(FiltersPackingMaterialsTransactionInitialValues);
        setIsOpen(false);
    }

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
                            onChange={handleFiltroChange} value={filters.transaction_id || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Responsable</label>
                        <input type="text" name="responsable" className="w-full border p-2 rounded" placeholder="Nombre del Responsable"
                            onChange={handleFiltroChange} value={filters.responsable || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Entregado Por</label>
                        <input type="text" name="delivered_by" className="w-full border p-2 rounded" placeholder="Nombre del responsable bodega"
                            onChange={handleFiltroChange} value={filters.delivered_by || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">SKU</label>
                        <input type="text" name="sku" className="w-full border p-2 rounded" placeholder="Código del sku"
                            onChange={handleFiltroChange} value={filters.sku || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Fecha de Uso</label>
                        <input type="date" name="delivered_date" className="w-full border p-2 rounded"
                            onChange={handleFiltroChange} value={filters.delivered_date || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Tipo de Transacción</label>
                        <select name="type" className="w-full border p-2 rounded" onChange={handleFiltroChange} value={filters.type || ""}>
                            <option value="">--SELECCIONE UNA OPCIÓN--</option>
                            <option value="1">Salida</option>
                            <option value="2">Devolución</option>
                        </select>
                    </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                    <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                        onClick={handleClearFilters}
                    >
                        Borrar Filtros
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
