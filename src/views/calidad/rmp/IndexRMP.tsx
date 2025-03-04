import { AlertCircleIcon, CheckCircle, EditIcon, Eye, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

import { getPaginatedBoletasRMP } from "@/api/ReceptionsDocAPI";

import { useAppStore } from "@/stores/useAppStore";
import { Boleta, FiletrsBoletaRMP } from "@/types";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/Pagination";
import FiltersRMP from "@/components/boleta-rmp/FiltersRMP";
import { Bars3Icon } from "@heroicons/react/16/solid";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import BoletaGRNModal from "@/components/boleta-rmp/BoletaGRNModal";

const status: { [key: number]: string } = {
    1: 'Pendiente de Recepción',
    2: 'Pendiente de Revision Calidad',
    3: 'Pendiente de GRN',
    5: 'GRN Aprobado'
}

const classes: { [key: number]: string } = {
    1: 'bg-orange-500',
    2: 'bg-indigo-500',
    3: 'bg-yellow-500',
    4: 'bg-yellow-500',
    5: 'bg-green-500'
}

export default function IndexRMP() {

    const [filters, setFilters] = useState<FiletrsBoletaRMP>({} as FiletrsBoletaRMP);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [boletas, setBoletas] = useState<Boleta[]>([]);
    const [role, setRole] = useState<string>();
    const [modalGRN, setModalGRN] = useState<boolean>(false);
    const [boletaSelected, setBoletaSelected] = useState<Boleta>();
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);

    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ['getPaginatedBoletasRMP', currentPage, filters],
        queryFn: () => getPaginatedBoletasRMP(currentPage, filters),
    });

    const results = useQueries({
        queries: [
            { queryKey: ['getUserRoleByToken'], queryFn: getUserRoleByToken }
        ]
    })

    useEffect(() => {
        if (data) {
            setBoletas(data.data);
            setCurrentPage(data.meta.current_page);
            setPageCount(data.meta.last_page);
        }
        if (results) {
            setRole(results[0].data);
        }
    }, [data, results]);


    const handleOpenModal = async (boleta: Boleta) => {
        setBoletaSelected(boleta);
        setModalGRN(true);
    }

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    if (isError) return <ShowErrorAPI />
    if (isLoading) return <Spinner />

    return (
        <div>
            <h2 className="font-bold text-4xl">Boletas Recepción de Materia Prima</h2>

            <div className="flex flex-row justify-end gap-5">
                {(role === 'pcalidad' || role === 'admin') && (
                    <Link
                        to="/rmp/crear"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                    >
                        <PlusIcon className="w-8" />
                        <p>Crear Boleta Materia Prima</p>
                    </Link>
                )}
            </div>

            <div className="w-full flex justify-end mt-5">
                <Bars3Icon className="w-8 cursor-pointer hover:text-gray-500" onClick={() => setIsOpen(true)} />
            </div>

            <div className="p-2 mt-10">
                <table className="table">
                    <thead>
                        <tr className="thead-tr">
                            <th scope="col" className="thead-th">CDP</th>
                            <th scope="col" className="thead-th">GRN</th>
                            <th scope="col" className="thead-th">Placa</th>
                            <th scope="col" className="thead-th">Producto</th>
                            <th scope="col" className="thead-th">Finca</th>
                            <th scope="col" className="thead-th">Variedad</th>
                            <th scope="col" className="thead-th">Coordinador</th>
                            <th scope="col" className="thead-th">Fecha</th>
                            <th scope="col" className="thead-th">Estado</th>
                            <th scope="col" className="thead-th">Consignación</th>
                            <th scope="col" className="thead-th">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boletas.map(boleta => (
                            <tr key={boleta.id} className="tbody-tr">
                                <td className="tbody-td">{boleta.cdp}</td>
                                <td className="tbody-td">{boleta.grn}</td>
                                <td className="tbody-td">{boleta.plate}</td>
                                <td className="tbody-td">{boleta.product}</td>
                                <td className="tbody-td">{boleta.finca}</td>
                                <td className="tbody-td">{boleta.variety}</td>
                                <td className="tbody-td">{boleta.coordinator}</td>
                                <td className="tbody-td">{boleta.date}</td>
                                <td className="tbody-td"><span className={`button ${classes[boleta.status]} text-xs`}>{status[boleta.status]}</span></td>
                                <td className="tbody-td">{boleta.consignacion ? <AlertCircleIcon className="w-8 text-red-500" /> : <CheckCircle className="w-8 text-green-500" />}</td>
                                <td className="tbody-td flex gap-5">
                                    <>
                                        {(boleta.status === 1 && role && (role === 'pprod')) && (
                                            <Link to={`/rmp/editar/${boleta.id}`}>
                                                <EditIcon />
                                            </Link>
                                        )}

                                        {(boleta.status === 2 && role && (role === 'pcalidad')) && (
                                            <Link to={`/rmp/editar/${boleta.id}`}>
                                                <EditIcon />
                                            </Link>
                                        )}

                                        {((boleta.status === 3 || boleta.status === 4) && role && (role === 'pprod')) && (
                                            <EditIcon className="cursor-pointer hover:text-gray-500" onClick={() => handleOpenModal(boleta)} />
                                        )}

                                        <Link to={`/rmp/documentos/${boleta.id}`}>
                                            <Eye />
                                        </Link>
                                    </>
                                </td>
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
            {boletaSelected && <BoletaGRNModal modal={modalGRN} setModal={setModalGRN} boleta={boletaSelected} refetch={refetch} />}
            <FiltersRMP filters={filters} setFilters={setFilters} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

    )
}
