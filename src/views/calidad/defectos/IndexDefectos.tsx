import { Edit, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect, useState } from "react";
import { Defect } from "../../../types";
import { toast } from "react-toastify";
import ShowErrorAPI from "../../../components/ShowErrorAPI";
import Spinner from "../../../components/Spinner";
import Pagination from "../../../components/Pagination";

export default function IndexDefectos() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [defects, setDefects] = useState<Defect[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const getDefectsPaginate = useAppStore((state) => state.getDefectsPaginate)

    const handleGetInfo = async (page: number) => {
        try {
            const data = await getDefectsPaginate(page);
            setDefects(data.data);
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
            <h2 className="font-bold text-4xl">Defectos</h2>
            <div className="flex flex-row justify-end gap-5">
                <Link
                    to="/defectos/crear"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                >
                    <PlusIcon />
                    <p>Crear Defecto</p>
                </Link>
            </div>

            {error && <ShowErrorAPI />}
            {(loading && !error && defects) ? <Spinner /> : (
                <>
                    <div className="mt-10">
                        <table className="table">
                            <thead>
                                <tr className="thead-tr">
                                    <th scope="col" className="thead-th">ID</th>
                                    <th scope="col" className="thead-th">Defecto</th>
                                    <th scope="col" className="thead-th">Variedad</th>
                                    <th scope="col" className="thead-th">Estado</th>
                                    <th scope="col" className="thead-th">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {defects.map(defect => (
                                    <tr key={defect.id} className="tbody-tr">
                                        <td className="tbody-td">{defect.id}</td>
                                        <td className="tbody-td">{defect.name}</td>
                                        <td className="tbody-td">{defect.quality_variety}</td>
                                        <td className='tbody-td'><span className={`${defect.status ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} button`}>{defect.status ? 'Activo' : 'Inactivo'}</span></td>
                                        <td>
                                            <Edit className="cursor-pointer hover:text-gray-500" />
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

        </>
    )
}
