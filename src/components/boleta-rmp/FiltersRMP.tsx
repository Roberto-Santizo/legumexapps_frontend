import { motion } from "framer-motion";
import { X } from "lucide-react";
import { getAllFincas } from "@/api/FincasAPI";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiletrsBoletaRMP, Finca, Producer, Product } from "@/types";
import { getProducts } from "@/api/ProductsAPI";
import Spinner from "../Spinner";

import { getAllProducers } from "@/api/ProducersAPI";
import { useQueries } from "@tanstack/react-query";

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
    const [tempFilters, setTempFilters] = useState<FiletrsBoletaRMP>({} as FiletrsBoletaRMP);

    const results = useQueries({
        queries: [
            { queryKey: ['getAllFincas'], queryFn: getAllFincas },
            { queryKey: ['getProducts'], queryFn: getProducts },
            { queryKey: ['getAllProducers'], queryFn: getAllProducers }
        ]
    });

    useEffect(() => {
        if (results.every(result => result.data)) {
            if (results[0].data) setFincas(results[0].data);
            if (results[1].data) setProducts(results[1].data);
            if (results[2].data) setProducers(results[2].data);
        }
    }, [results]);


    const isLoading = results.some(result => result.isLoading);

    const handleFilterTempChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTempFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFilterData = () => {
        setFilters(tempFilters);
        setIsOpen(false);
    }

    const handleResetFilters = () => {
        setFilters({} as FiletrsBoletaRMP);
        setIsOpen(false);
    }

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
                className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg z-50 p-4"
            >
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold">Filtros</h2>
                    <button onClick={() => setIsOpen(false)} className="p-2">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Fecha</label>
                        <input type="date" name="date" className="w-full border p-2 rounded" onChange={(e) => handleFilterTempChange(e)} value={tempFilters.date} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Placa</label>
                        <input name="plate" placeholder="Ej. C123ABC" type="text" className="w-full border p-2 rounded" onChange={(e) => handleFilterTempChange(e)} value={tempFilters.plate} />
                    </div>


                    <div>
                        <label className="block text-sm font-medium">Finca</label>
                        <select
                            className="w-full border p-2 rounded"
                            name="finca_id"
                            onChange={(e) => handleFilterTempChange(e)}
                            value={tempFilters.finca_id}
                        >
                            <option value="">Todas</option>
                            {fincas.map((finca) => (
                                <option key={finca.id} value={finca.id}>
                                    {finca.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Producto</label>
                        <select
                            className="w-full border p-2 rounded"
                            name="product_id"
                            onChange={(e) => handleFilterTempChange(e)}
                            value={tempFilters.product_id}
                        >
                            <option value="">Todos</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.product} - {product.variety}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Productores</label>
                        <select
                            className="w-full border p-2 rounded"
                            name="producer_id"
                            onChange={(e) => handleFilterTempChange(e)}
                            value={tempFilters.producer_id}
                        >
                            <option value="">Todos</option>
                            {producers.map((producer) => (
                                <option key={producer.id} value={producer.id}>
                                    {producer.name} - {producer.code}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        className="button bg-indigo-500 hover:bg-indigo-600 w-full text-white py-2 rounded"
                        onClick={handleFilterData}
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner /> : "Filtrar"}
                    </button>

                    <button
                        className="button bg-red-500 hover:bg-red-600 w-full text-white py-2 rounded"
                        onClick={handleResetFilters}
                        disabled={isLoading}
                    >
                        Borrar Filtros
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
