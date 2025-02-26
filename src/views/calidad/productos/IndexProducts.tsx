import { Edit, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import Spinner from "@/components/Spinner";
import { Product } from "@/types";
import Pagination from "@/components/Pagination";
import { getPaginatedProducts } from "@/api/ProductsAPI";
import { useQuery } from "@tanstack/react-query";


export default function IndexVarieties() {
    const [products, setProducts] = useState<Product[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);


    const { data, isError, isLoading } = useQuery({
        queryKey: ['getPaginatedProducts', currentPage],
        queryFn: () => getPaginatedProducts(currentPage)
    });

    useEffect(() => {
        if (data) {
            setProducts(data.data);
            setPageCount(data.meta.last_page);
            setCurrentPage(data.meta.current_page);
        }
    }, [data])

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };


    if (isLoading) return <Spinner />
    if (isError) return <ShowErrorAPI />

    return (
        <>
            <div>
                <h2 className="font-bold text-4xl">Productos</h2>
                <div className="flex flex-row justify-end gap-5 mb-5">
                    <div className="flex flex-row justify-end gap-5">
                        <Link
                            to="/productos/crear"

                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                        >
                            <PlusIcon />
                            <p>Crear Producto</p>
                        </Link>
                        <Link
                            to="/productos/variedades"

                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                        >
                            <p>Variedades</p>
                        </Link>
                    </div>
                </div>
                <div className="p-2 overflow-y-auto mt-10">
                    <table className="table">
                        <thead>
                            <tr className="thead-tr">
                                <th scope="col" className="thead-th">ID</th>
                                <th scope="col" className="thead-th">Producto</th>
                                <th scope="col" className="thead-th">Variedad</th>
                                <th scope="col" className="thead-th">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr className="tbody-tr" key={product.id}>
                                    <td className="tbody-td">{product.id}</td>
                                    <td className="tbody-td">{product.product}</td>
                                    <td className="tbody-td">{product.variety}</td>
                                    <td className="tbody-td flex gap-5">
                                        <Link to={`/productos/${product.id}/editar`}>
                                            <Edit className="hover:text-gray-500" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mb-10 flex justify-end">
                    <Pagination
                        currentPage={currentPage}
                        pageCount={pageCount}
                        handlePageChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    )
}
