import { FiltersPackingMaterialsType } from "@/views/bodega/packing-material-item/Index";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setTempFilters: Dispatch<SetStateAction<FiltersPackingMaterialsType>>;
    setFilters: Dispatch<SetStateAction<FiltersPackingMaterialsType>>;
    tempFilters: FiltersPackingMaterialsType;
    filters: FiltersPackingMaterialsType;
}

const initialValues = {
    name: '',
    code: '',
    status: '',
    supplier: ''
};


export default function FiltersMaterialEmpaque({ isOpen, setIsOpen, setTempFilters, setFilters, tempFilters, filters }: Props) {

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
                        <label className="block text-sm font-medium">Nombre</label>
                        <input type="text" name="name" className="w-full border p-2 rounded" placeholder="Nombre del item"
                            onChange={handleFilterTempChange} value={tempFilters.name || ""} autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Código</label>
                        <input type="text" name="code" className="w-full border p-2 rounded" placeholder="Nombre del item"
                            onChange={handleFilterTempChange} value={tempFilters.code || ""} autoComplete="off"
                        />
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium">Proveedor</label>
                        <input type="text" name="supplier" className="w-full border p-2 rounded" placeholder="Nombre del proveedor"
                            onChange={handleFilterTempChange} value={tempFilters.supplier || ""} autoComplete="off"
                        />
                    </div> */}
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
