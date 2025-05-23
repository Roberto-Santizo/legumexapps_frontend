import type { FiltersReceptionsPackingMaterial } from "@/views/bodega/recepcion-material-empaque/IndexRecepcionMaterial";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPackingMaterials } from "@/api/MaterialEmpaqueAPI";
import { FiltersPackingMaterialsInitialValues } from "@/views/bodega/material-empaque/IndexMaterialEmpaque";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setTempFilters: Dispatch<SetStateAction<FiltersReceptionsPackingMaterial>>;
    setFilters: Dispatch<SetStateAction<FiltersReceptionsPackingMaterial>>;
    tempFilters: FiltersReceptionsPackingMaterial;
    filters: FiltersReceptionsPackingMaterial;
}

const initialValues: FiltersReceptionsPackingMaterial = {
    supervisor_name: '',
    received_by: '',
    contains: '',
    receipt_date: '',
    invoice_date: '',
}

export default function FiltersReceptionsPackingMaterial({ isOpen, setIsOpen, setTempFilters, setFilters, tempFilters, filters }: Props) {

    const { data } = useQuery({
        queryKey: ['getPackingMaterials'],
        queryFn: () => getPackingMaterials({ currentPage: 1, paginated: '', filters: FiltersPackingMaterialsInitialValues })
    });

    const handleFilterTempChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTempFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilterData = () => {
        setFilters(tempFilters);
        setIsOpen(false);
    };

    const handleResetFilters = () => {
        setFilters(initialValues);
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
                        <label className="block text-sm font-medium">Nombre del Supervisor</label>
                        <input type="text" name="supervisor_name" className="w-full border p-2 rounded" placeholder="Nombre del Supervisor"
                            onChange={handleFilterTempChange} value={tempFilters.supervisor_name || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Nombre del Receptor</label>
                        <input type="text" name="received_by" className="w-full border p-2 rounded" placeholder="Nombre del Receptor"
                            onChange={handleFilterTempChange} value={tempFilters.received_by || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Fecha de Recepción</label>
                        <input type="date" name="receipt_date" className="w-full border p-2 rounded"
                            onChange={handleFilterTempChange} value={tempFilters.receipt_date || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Fecha de Factura</label>
                        <input type="date" name="invoice_date" className="w-full border p-2 rounded"
                            onChange={handleFilterTempChange} value={tempFilters.invoice_date || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Item</label>
                        <select className="w-full border p-2 rounded" name="contains"
                            onChange={handleFilterTempChange} value={tempFilters.contains || ""}>
                            <option value="">Todos</option>
                            {data?.data?.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
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
