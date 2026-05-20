import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { FiltersLinesPerformance, FiltersLinesPerformanceInitialValues } from "@/views/produccion/lines-performances/Index";
import { motion } from "framer-motion";
import { SetURLSearchParams } from "react-router-dom";
import { X } from "lucide-react";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setFilters: Dispatch<SetStateAction<FiltersLinesPerformance>>;
    filters: FiltersLinesPerformance;
    setSearchParams: SetURLSearchParams;
    searchParams: URLSearchParams;
}

export default function FiltersLineSku({ isOpen, setIsOpen, setFilters, filters, setSearchParams, searchParams }: Props) {

    const handleFiltroChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            [e.target.name]: e.target.value,
        });
    };

    const handleClearFilters = () => {
        setSearchParams({});
        setFilters(FiltersLinesPerformanceInitialValues);
        setIsOpen(false);
    }

    console.log(filters);

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
                        <label className="block text-sm font-medium">Nombre de la línea</label>
                        <input type="text" name="line" className="w-full border p-2 rounded" placeholder="Nombre de la línea"
                            onChange={handleFiltroChange} value={filters.line || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Código del SKU</label>
                        <input type="text" name="sku" className="w-full border p-2 rounded" placeholder="Código del SKU"
                            onChange={handleFiltroChange} value={filters.sku || ""} autoComplete="off"
                        />
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
