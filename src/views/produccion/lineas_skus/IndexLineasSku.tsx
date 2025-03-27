import { getPaginatedLineasSKU, LineaSKU } from "@/api/LineasSkuAPI";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import Pagination from "@/components/Pagination";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import Spinner from "@/components/Spinner";

export default function IndexLineasSku() {
    const [skus, setSkus] = useState<LineaSKU[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getPaginatedLineasSKU', currentPage],
        queryFn: () => getPaginatedLineasSKU(currentPage)
    });

    useEffect(() => {
        if (data) {
            setPageCount(data.meta.last_page);
            setCurrentPage(data.meta.current_page);
            setSkus(data.data);
        }
    }, [data])


    if (isLoading) return <Spinner />;
    if (isError) return <ShowErrorAPI />;
    if (skus) return (
        <div>
            <h2 className="font-bold text-4xl">Lineas & SKUS</h2>

            <div className="flex justify-end">
                <Link
                    to="/lineas-skus/crear"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                >
                    <PlusIcon className="w-8" />
                    <p>Relacionar Linea a SKU</p>
                </Link>
            </div>
            <table className="table mt-10">
                <thead>
                    <tr className="thead-tr">
                        <th className="thead-th">Linea</th>
                        <th className="thead-th">SKU</th>
                        <th className="thead-th">Cliente</th>
                        <th className="thead-th">Producto</th>
                        <th className="thead-th">Turno</th>
                        <th className="thead-th">Libras/Hora</th>
                    </tr>
                </thead>
                <tbody>
                    {skus.map(sku => (
                        <tr key={sku.id} className="tbody-tr">
                            <td className="tbody-td">{sku.line}</td>
                            <td className="tbody-td">{sku.sku}</td>
                            <td className="tbody-td">{sku.client}</td>
                            <td className="tbody-td">{sku.product}</td>
                            <td className="tbody-td">{sku.shift}</td>
                            <td className="tbody-td">{sku.performance}</td>
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
