import { AlertCircleIcon, CheckCircle, EditIcon, Eye, PlusIcon, RefreshCcwDot } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQueries, useQuery, useMutation } from "@tanstack/react-query";
import { Boleta, getBoletasRMP, rejectBoleta } from "@/api/ReceptionsDocAPI";
import { Bars3Icon } from "@heroicons/react/16/solid";
import { toast } from "react-toastify";
import { getUserRole } from "@/api/UserAPI";
import { usePermissions } from "@/hooks/usePermissions";
import Spinner from "@/components/utilities-components/Spinner";
import Pagination from "@/components/utilities-components/Pagination";
import FiltersRMP, { FiletrsBoletaRMPInitialValues, FiltersBoletaRMP } from "@/components/filters/FiletrsRMP";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import ModalGRN from "@/components/modals/ModalGRN";
import Swal from "sweetalert2";
import StatusComponent from "@/components/boleta-rmp/StatusComponent";


export default function Index() {
    const [filters, setFilters] = useState<FiltersBoletaRMP>(FiletrsBoletaRMPInitialValues);
    const { hasPermission } = usePermissions();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [boletas, setBoletas] = useState<Boleta[]>([]);
    const [role, setRole] = useState<string>();
    const [modalGRN, setModalGRN] = useState<boolean>(false);
    const [boletaSelected, setBoletaSelected] = useState<Boleta>();
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ['getPaginatedBoletasRMP', currentPage, filters],
        queryFn: () => getBoletasRMP({ page: currentPage, filters, paginated: 'true', transport_doc_create: '' }),
    });

    const { mutate } = useMutation({
        mutationFn: rejectBoleta,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            refetch();
        }
    });

    const results = useQueries({
        queries: [
            { queryKey: ['getUserRoleByToken'], queryFn: getUserRole }
        ]
    })

    useEffect(() => {
        if (data) {
            setBoletas(data.data);
        }

        if (data && data.meta) {
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

    const handleRejectBoleta = (id: Boleta['id']) => {
        Swal.fire({
            title: "¿Quieres rechazar esta boleta?",
            showCancelButton: true,
            confirmButtonText: "Rechazar",
        }).then((result) => {
            if (result.isConfirmed) {
                mutate(id);
            }
        });
    }

    if (isError) return <ShowErrorAPI />
    if (isLoading) return <Spinner />
    if (role) return (
        <div className="p-4">
            <h2 className="font-bold text-2xl md:text-4xl">
                Boletas Recepción de Materia Prima
            </h2>

            <div className="flex flex-col items-end gap-3 mt-10">
                {hasPermission('create rmp doc') && (
                    <Link
                        to="/rmp/crear"
                        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded uppercase flex justify-center items-center"
                    >
                        <PlusIcon className="w-6 md:w-8" />
                        <p className="text-sm md:text-base">Crear Boleta Materia Prima</p>
                    </Link>
                )}


                <Bars3Icon
                    className="w-6 md:w-8 cursor-pointer hover:text-gray-500"
                    onClick={() => setIsOpen(true)}
                />
            </div>

            <div className="w-full overflow-x-auto mt-5">
                <table className="table min-w-full">
                    <thead>
                        <tr className="thead-tr">
                            <th className="thead-th">GRN</th>
                            <th className="thead-th">Placa</th>
                            <th className="thead-th">Producto</th>
                            <th className="thead-th">Fecha</th>
                            <th className="thead-th">Estado</th>
                            <th className="thead-th">Consignación</th>
                            <th className="thead-th">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boletas.map(boleta => (
                            <tr key={boleta.id} className="tbody-tr text-sm md:text-base">
                                <td className="tbody-td">{boleta.grn ?? 'SIN GRN'}</td>
                                <td className="tbody-td">{boleta.plate}</td>
                                <td className="tbody-td">{boleta.product}</td>
                                <td className="tbody-td">{boleta.date}</td>
                                <td className="tbody-td">
                                    <StatusComponent id={boleta.quality_status_id} tag={boleta.status} />
                                </td>

                                <td className="tbody-td">
                                    {boleta.consignacion ? (
                                        <AlertCircleIcon className="w-6 md:w-8 text-red-500" />
                                    ) : (
                                        <CheckCircle className="w-6 md:w-8 text-green-500" />
                                    )}
                                </td>
                                <td className="tbody-td flex gap-3">
                                    <>
                                        {(boleta.quality_status_id === 1 && role === 'admin') && (
                                            <Link to={`/rmp/editar/${boleta.id}`}>
                                                <EditIcon />
                                            </Link>
                                        )}

                                        {(boleta.quality_status_id === 2 && role === 'admin') && (
                                            <Link to={`/rmp/editar/${boleta.id}`}>
                                                <EditIcon />
                                            </Link>
                                        )}

                                        {(boleta.quality_status_id === 3 && role === 'admin') && (
                                            <EditIcon className="cursor-pointer hover:text-gray-500" onClick={() => handleOpenModal(boleta)} />
                                        )}

                                        {((role === 'pcalidad' || role == 'admin') && boleta.quality_status_id === 4) && (
                                            <RefreshCcwDot className="cursor-pointer hover:text-gray-500" onClick={() => handleRejectBoleta(boleta.id)} />
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
            </div>

            <div className="mt-5 mb-10 flex justify-center md:justify-end">
                <Pagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    handlePageChange={handlePageChange}
                />
            </div>

            {boletaSelected && (
                <ModalGRN
                    modal={modalGRN}
                    setModal={setModalGRN}
                    boleta={boletaSelected}
                    refetch={refetch}
                />
            )}

            {isOpen && (
                <FiltersRMP filters={filters} setFilters={setFilters} isOpen={isOpen} setIsOpen={setIsOpen} />
            )}
        </div>
    );

}
