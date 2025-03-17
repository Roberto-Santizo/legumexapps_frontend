import { motion } from "framer-motion";
import { X } from "lucide-react";
import { getAllFincas } from "@/api/FincasAPI";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiletrsBoletaRMP, Finca, Producer, Product } from "@/types";
import { getProducts } from "@/api/ProductsAPI";
import Spinner from "../Spinner";
import { getAllProducers } from "@/api/ProducersAPI";
import { useQueries } from "@tanstack/react-query";
import { getQualityStatuses, QualityStatus } from "@/api/ReceptionsDocAPI";

type Props = {
    filters: FiletrsBoletaRMP;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setFilters: Dispatch<SetStateAction<FiletrsBoletaRMP>>;
    isOpen: boolean;
};

export default function FiltersRMP({ isOpen, setIsOpen, filters, setFilters }: Props) {
    const [fincas, setFincas] = useState<Finca[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [producers, setProducers] = useState<Producer[]>([]);
    const [statuses, setStatuses] = useState<QualityStatus[]>([]);
    const [tempFilters, setTempFilters] = useState<FiletrsBoletaRMP>({} as FiletrsBoletaRMP);

    const results = useQueries({
        queries: [
            { queryKey: ['getAllFincas'], queryFn: getAllFincas },
            { queryKey: ['getProducts'], queryFn: getProducts },
            { queryKey: ['getAllProducers'], queryFn: getAllProducers },
            { queryKey: ['getQualityStatuses'], queryFn: getQualityStatuses }
        ]
    });

    useEffect(() => {
        if (results.every(result => result.data)) {
            setFincas(results[0].data || []);
            setProducts(results[1].data || []);
            setProducers(results[2].data || []);
            setStatuses(results[3].data || []);
        }
    }, [results]);

    const isLoading = results.some(result => result.isLoading);

    const handleFilterTempChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTempFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilterData = () => {
        setFilters(tempFilters);
        setIsOpen(false);
    };

    const handleResetFilters = () => {
        setFilters({} as FiletrsBoletaRMP);
        setIsOpen(false);
    };

    useEffect(() => {
        setTempFilters(filters);
    }, [filters]);

    return (
        <div className="relative">
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

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
                        <label className="block text-sm font-medium">Fecha</label>
                        <input type="date" name="date" className="w-full border p-2 rounded"
                            onChange={handleFilterTempChange} value={tempFilters.date || ""} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Placa</label>
                        <input name="plate" placeholder="Ej. C123ABC" type="text"
                            className="w-full border p-2 rounded"
                            onChange={handleFilterTempChange} value={tempFilters.plate || ""} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">GRN</label>
                        <input name="grn" placeholder="Ej. LT0001" type="text"
                            className="w-full border p-2 rounded"
                            onChange={handleFilterTempChange} value={tempFilters.grn || ""} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Documento Referencia</label>
                        <input name="ref_doc" placeholder="Ej. LT0001" type="text"
                            className="w-full border p-2 rounded"
                            onChange={handleFilterTempChange} value={tempFilters.ref_doc || ""} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Finca</label>
                        <select className="w-full border p-2 rounded" name="finca_id"
                            onChange={handleFilterTempChange} value={tempFilters.finca_id || ""}>
                            <option value="">Todas</option>
                            {fincas.map(finca => (
                                <option key={finca.id} value={finca.id}>{finca.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Estado</label>
                        <select className="w-full border p-2 rounded" name="quality_status_id"
                            onChange={handleFilterTempChange} value={tempFilters.quality_status_id || ""}>
                            <option value="">Todas</option>
                            {statuses.map(status => (
                                <option key={status.id} value={status.id}>{status.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Producto</label>
                        <select className="w-full border p-2 rounded" name="product_id"
                            onChange={handleFilterTempChange} value={tempFilters.product_id || ""}>
                            <option value="">Todos</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.product} - {product.variety}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Productores</label>
                        <select className="w-full border p-2 rounded" name="producer_id"
                            onChange={handleFilterTempChange} value={tempFilters.producer_id || ""}>
                            <option value="">Todos</option>
                            {producers.map(producer => (
                                <option key={producer.id} value={producer.id}>
                                    {producer.name} - {producer.code}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Botones en la parte inferior */}
                <div className="border-t pt-3 space-y-2">
                    <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded"
                        onClick={handleFilterData} disabled={isLoading}>
                        {isLoading ? <Spinner /> : "Filtrar"}
                    </button>

                    <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                        onClick={handleResetFilters} disabled={isLoading}>
                        Borrar Filtros
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
