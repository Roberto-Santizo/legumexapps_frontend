import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getTransportistasPaginated, Transportista } from "@/api/TransportistasAPI";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";

export default function IndexTransportistas() {
    const [transportistas, setTransportistas] = useState<Transportista[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getTransportistasPaginated', currentPage],
        queryFn: () => getTransportistasPaginated(currentPage)
    })

    useEffect(() => {
        if (data) {
            setTransportistas(data.data);
            setCurrentPage(data.meta.current_page);
            setPageCount(data.meta.last_page);
        }
    }, [data]);


    if (isLoading) return <Spinner />
    if (isError) return <ShowErrorAPI />

    return (
        <>
            <h1 className="text-3xl font-bold">Transportistas</h1>

            <div className="flex flex-col md:flex-row justify-end items-center gap-3 mt-10">
                <Link
                    to="/transportistas/crear"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
                >
                    <PlusIcon className="w-6 md:w-8" />
                    <p className="text-sm md:text-base">Crear Transportista</p>
                </Link>

                <Link
                    to="/transportistas/pilotos"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
                >
                    <p className="text-sm md:text-base">Pilotos</p>
                </Link>

                <Link
                    to="/transportistas/placas"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
                >
                    <p className="text-sm md:text-base">Placas</p>
                </Link>
            </div>

            <table className="table mt-10">
                <thead>
                    <tr className="thead-tr">
                        <th className="thead-th">Codigo</th>
                        <th className="thead-th">Nombre</th>
                    </tr>
                </thead>
                <tbody>
                    {transportistas.map(transportista => (
                        <tr key={transportista.id} className="tbody-tr">
                            <td className="tbody-td">{transportista.code}</td>
                            <td className="tbody-td">{transportista.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-5 mb-10 flex justify-center md:justify-end">
                <Pagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    handlePageChange={handlePageChange}
                />
            </div>
        </>
    )
}
