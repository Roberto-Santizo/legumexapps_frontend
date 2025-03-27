import { getPaginatedSKUProducts, ProductSKU } from "@/api/ProductsSkuAPI";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import Spinner from "@/components/Spinner";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";


export default function IndexClientes() {
    const [products, setProducts] = useState<ProductSKU[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getPaginatedSKUProducts', currentPage],
        queryFn: () => getPaginatedSKUProducts(currentPage)
    });

    useEffect(() => {
        if (data) {
            setPageCount(data.meta.last_page);
            setCurrentPage(data.meta.current_page);
            setProducts(data.data);
        }
    }, [data]);

    if (isLoading) return <Spinner />
    if (isError) return <ShowErrorAPI />
    if (products) return (
        <div>
            <h2 className="font-bold text-4xl">Productos</h2>

            <div className="flex justify-end">
                <Link
                    to="/productos-sku/crear"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                >
                    <PlusIcon className="w-8" />
                    <p>Crear Producto</p>
                </Link>

            </div>
            <table className="table mt-10">
                <thead>
                    <tr className="thead-tr">
                        <th className="thead-th">Nombre</th>
                        <th className="thead-th">Presentación</th>
                        <th className="thead-th">Peso de Caja (LBS)</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr className="tbody-tr">
                            <td className="tbody-td">{product.name}</td>
                            <td className="tbody-td">{product.presentation}</td>
                            <td className="tbody-td">{product.box_weight ?? 'SIN DATOS'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mb-10 flex justify-end">
                <Pagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    handlePageChange={handlePageChange}
                />
            </div>
        </div>
    )
}
