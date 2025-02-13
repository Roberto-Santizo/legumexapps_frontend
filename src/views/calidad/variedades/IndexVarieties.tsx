import { Eye, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import Spinner from "../../../components/Spinner";
import { QualityVariety } from "../../../types";
import Pagination from "../../../components/Pagination";


export default function IndexVarieties() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>();
    const [varieties, setVarieties] = useState<QualityVariety[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const getVarietiesPaginate = useAppStore((state) => state.getVarietiesPaginate);


    const handleGetInfo = async (page: number) => {
        setLoading(true);
        try {
            const data = await getVarietiesPaginate(page);
            setVarieties(data.data);
            setPageCount(data.meta.last_page);
            setCurrentPage(data.meta.current_page);
        } catch (error) {
            toast.error('Hubo un error al traer la información');
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    useEffect(() => {
        handleGetInfo(currentPage);
    }, [currentPage]);

    return (
        <>
            <div>
                <h2 className="font-bold text-4xl">Variedades</h2>
                <div className="flex flex-row justify-end gap-5 mb-5">
                    <div className="flex flex-row justify-end gap-5">
                        <Link
                            to="/variedades/crear"

                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                        >
                            <PlusIcon className="w-8" />
                            <p>Crear Variedad</p>
                        </Link>
                    </div>
                </div>
                {error && <ShowErrorAPI />}
                {(loading && !error) ? <Spinner /> : (
                    <>
                        <div className="p-2 overflow-y-auto mt-10">
                            <table className="table">
                                <thead>
                                    <tr className="thead-tr">
                                        <th scope="col" className="thead-th">ID</th>
                                        <th scope="col" className="thead-th">Variedad</th>
                                        <th scope="col" className="thead-th">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {varieties.map(variety => (
                                        <tr className="tbody-tr" key={variety.id}>
                                            <td className="tbody-td">{variety.id}</td>
                                            <td className="tbody-td">{variety.name}</td>
                                            <td className="tbody-td">
                                                <Eye />
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
                    </>
                )}
            </div>
        </>
    )
}
