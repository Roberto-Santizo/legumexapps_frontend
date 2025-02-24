import { motion } from "framer-motion";
import { X } from "lucide-react";
import { getAllFincas } from "@/api/FincasAPI";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Boleta, Finca, Producer, Product } from "@/types";
import { toast } from "react-toastify";
import { getProducts } from "@/api/ProductsAPI";
import Spinner from "../Spinner";

import { getAllProducers } from "@/api/ProducersAPI";

type Props = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setBoletas: Dispatch<SetStateAction<Boleta[]>>;
    setFincaId: Dispatch<SetStateAction<Finca['id']>>;
    setProductId: Dispatch<SetStateAction<Product['id']>>;
    setProducerId: Dispatch<SetStateAction<Producer['id']>>;
    setDate: Dispatch<SetStateAction<string>>;
    setPlate: Dispatch<SetStateAction<string>>;
    fincaId: Finca['id'];
    productId: Product['id'];
    producerId: Producer['id'];
    date: string;
    plate: string;
    handleFilters: () => Promise<void>;
    handleReset: () => Promise<void>;

};

export default function FiltersRMP({ isOpen, setIsOpen, setFincaId, setProductId, fincaId, productId, handleFilters, handleReset, producerId, setProducerId, date, setDate, plate, setPlate }: Props) {
    const [fincas, setFincas] = useState<Finca[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [producers, setProducers] = useState<Producer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const handleGetInfo = async () => {
            try {
                const data = await getAllFincas();
                const data2 = await getProducts();
                const data3 = await getAllProducers();
                setFincas(data);
                setProducts(data2);
                setProducers(data3);
            } catch (error) {
                toast.error("Hubo un error al traer las fincas");
            } finally {
                setLoading(false);
            }
        };
        handleGetInfo();
    }, []);


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
                        <input type="date" className="w-full border p-2 rounded" onChange={(e) => setDate(e.target.value)} value={date} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Placa</label>
                        <input placeholder="Ej. C123ABC" type="text" className="w-full border p-2 rounded" onChange={(e) => setPlate(e.target.value)} value={plate} />
                    </div>


                    <div>
                        <label className="block text-sm font-medium">Finca</label>
                        <select
                            className="w-full border p-2 rounded"
                            onChange={(e) => setFincaId(e.target.value)}
                            value={fincaId}
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
                            onChange={(e) => setProductId(e.target.value)}
                            value={productId}
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
                            onChange={(e) => setProducerId(e.target.value)}
                            value={producerId}
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
                        onClick={() => handleFilters()}
                        disabled={loading}
                    >
                        {loading ? <Spinner /> : "Filtrar"}
                    </button>

                    <button
                        className="button bg-red-500 hover:bg-red-600 w-full text-white py-2 rounded"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Borrar Filtros
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
