import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { getPaginatedTransporteInspections, TransporteInspection } from "@/api/BoletaTransporteAPI";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import Pagination from "@/components/utilities-components/Pagination";

export default function IndexCamion() {
    const [docs, setDocs] = useState<TransporteInspection[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { data, isError, isLoading } = useQuery({
        queryKey: ['getPaginatedTransporteInspections', currentPage],
        queryFn: () => getPaginatedTransporteInspections(currentPage)
    });

    useEffect(() => {
        if (data) {
            setDocs(data.data);
            setCurrentPage(data.meta.current_page);
            setPageCount(data.meta.last_page);
        }
    }, [data]);

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    if (isLoading) return <Spinner />;
    if (isError) return <ShowErrorAPI />;
    return (
        <div>
            <div className="flex flex-row justify-end gap-5">
                <Link
                    to="/transporte-boleta/crear"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                >
                    <PlusIcon className="w-8" />
                    <p>Crear Boleta de Camion</p>
                </Link>

                <Link
                    to="/transporte-boleta/condiciones"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                >
                    <p>Condiciones</p>
                </Link>
            </div>

            <div className="p-2 h-96 overflow-y-auto mt-10">
                <table className="table">
                    <thead>
                        <tr className="thead-tr">
                            <th scope="col" className="thead-th uppercase">ID</th>
                            <th scope="col" className="thead-th uppercase">Tipo de camión</th>
                            <th scope="col" className="thead-th uppercase">Piloto</th>
                            <th scope="col" className="thead-th uppercase">Planta</th>
                            <th scope="col" className="thead-th uppercase">Placa</th>
                            <th scope="col" className="thead-th uppercase">Fecha</th>
                            <th scope="col" className="thead-th uppercase">Finca</th>
                        </tr>
                    </thead>
                    <tbody>
                        {docs.map(doc => (
                            <tr key={doc.id} className="tbody-tr">
                                <td className="tbody-td">{doc.id}</td>
                                <td className="tbody-td">{doc.truck_type}</td>
                                <td className="tbody-td">{doc.pilot_name}</td>
                                <td className="tbody-td">{doc.planta}</td>
                                <td className="tbody-td">{doc.plate}</td>
                                <td className="tbody-td">{doc.date}</td>
                                <td className="tbody-td">{doc.finca}</td>
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
        </div>

    )
}
