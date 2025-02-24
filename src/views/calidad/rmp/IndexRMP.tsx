import { EditIcon, Eye, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getPaginatedBoletasRMP } from "@/api/ReceptionsDocAPI";

import { useAppStore } from "@/stores/useAppStore";
import { Boleta } from "@/types";
import Spinner from "@/components/Spinner";
import BoletaGRNModal from "@/components/boleta-rmp/BoletaGRNModal";
import Pagination from "@/components/Pagination";
import FiltersRMP from "@/components/boleta-rmp/FiltersRMP";
import { Bars3Icon } from "@heroicons/react/16/solid";

const status: { [key: number]: string } = {
    1: 'Pendiente de Recepción',
    2: 'Pendiente de Revision Calidad',
    3: 'Pendiente de GRN',
    4: 'No aplica (pendiente de GRN)',
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

    const [fincaId, setFincaId] = useState<string>("");
    const [productId, setProductId] = useState<string>("");
    const [producerId, setProducerId] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [plate, setPlate] = useState<string>("");

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [boletas, setBoletas] = useState<Boleta[]>([]);
    const [role, setRole] = useState<string>();
    const [modalGRN, setModalGRN] = useState<boolean>(false);
    const [boletaSelected, setBoletaSelected] = useState<Boleta>();
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);


    const handleGetBoletas = async (page: number) => {
        setLoading(true);
        try {
            const filters: Record<string, string> = {};
            if (fincaId) filters.finca_id = fincaId;
            if (productId) filters.product_id = productId;

            const data = await getPaginatedBoletasRMP(page, filters);
            setBoletas(data.data);
            setPageCount(data.meta.last_page);
            setCurrentPage(data.meta.current_page);
        } catch (error) {
            toast.error('Hubo un error al traer la información');
        } finally {
            setLoading(false)
        }
    }

    const handleGetUserRole = async () => {
        try {
            const role = await getUserRoleByToken();
            setRole(role);
        } catch (error) {
            toast.error("Error al cargar el contenido");
        }
    };

    const handleOpenModal = async (boleta: Boleta) => {
        setBoletaSelected(boleta);
        setModalGRN(true);
    }
    useEffect(() => {
        handleGetUserRole();
    }, []);

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    const handleFilters = async () => {
        try {
            setLoading(true);
            const filters: Record<string, string> = {};
            if (fincaId) filters.finca_id = fincaId;
            if (productId) filters.product_id = productId;
            if (producerId) filters.producer_id = producerId;
            if (date) filters.date = date;
            if (plate) filters.plate = plate;

            const data = await getPaginatedBoletasRMP(1, filters);
            setBoletas(data.data);
            setPageCount(data.meta.last_page);
            setCurrentPage(data.meta.current_page);
        } catch (error) {
            toast.error("Error al filtrar boletas");
        } finally {
            setLoading(false);
            setIsOpen(false);
        }
    };

    const handleReset = async () => {
        setFincaId('');
        setProductId('');
        setProducerId('');
        setDate('');
        setPlate('');
        const data = await getPaginatedBoletasRMP(1, {});
        setBoletas(data.data);
        setPageCount(data.meta.last_page);
        setCurrentPage(data.meta.current_page);
        setIsOpen(false);
    }

    useEffect(() => {
        handleGetBoletas(currentPage);
    }, [currentPage]);

    return (
        <>
            <div>
                <h2 className="font-bold text-4xl">Boletas Recepción de Materia Prima</h2>

                <div className="flex flex-row justify-end gap-5">
                    <Link
                        to="/rmp/crear"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                    >
                        <PlusIcon className="w-8" />
                        <p>Crear Boleta Materia Prima</p>
                    </Link>

                </div>

                <div className="w-full flex justify-end mt-5">
                    <Bars3Icon className="w-8 cursor-pointer hover:text-gray-500" onClick={() => setIsOpen(true)} />
                </div>

                {(loading) ? <Spinner /> : (
                    <>
                        <div className="p-2 h-96 overflow-y-auto mt-10">
                            <table className="table">
                                <thead>
                                    <tr className="thead-tr">
                                        <th scope="col" className="thead-th">ID</th>
                                        <th scope="col" className="thead-th">Placa</th>
                                        <th scope="col" className="thead-th">Producto</th>
                                        <th scope="col" className="thead-th">Finca</th>
                                        <th scope="col" className="thead-th">Variedad</th>
                                        <th scope="col" className="thead-th">Coordinador</th>
                                        <th scope="col" className="thead-th">Fecha</th>
                                        <th scope="col" className="thead-th">Estado</th>
                                        <th scope="col" className="thead-th">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boletas.map(boleta => (
                                        <tr key={boleta.id} className="tbody-tr">
                                            <td className="tbody-td">{boleta.id}</td>
                                            <td className="tbody-td">{boleta.plate}</td>
                                            <td className="tbody-td">{boleta.product}</td>
                                            <td className="tbody-td">{boleta.finca}</td>
                                            <td className="tbody-td">{boleta.variety}</td>
                                            <td className="tbody-td">{boleta.coordinator}</td>
                                            <td className="tbody-td">{boleta.date}</td>
                                            <td className="tbody-td"><span className={`button ${classes[boleta.status]} text-sm`}>{status[boleta.status]}</span></td>
                                            <td className="tbody-td flex gap-5">
                                                {loading ? <Spinner /> : (
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

                                                        {boleta.status === 5 && (
                                                            <Link to={`/rmp/documentos/${boleta.id}`}>
                                                                <Eye />
                                                            </Link>
                                                        )}

                                                    </>
                                                )}

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mb-10 flex justify-end">
                                {!loading && (
                                    <Pagination
                                        currentPage={currentPage}
                                        pageCount={pageCount}
                                        handlePageChange={handlePageChange}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {boletaSelected && <BoletaGRNModal modal={modalGRN} setModal={setModalGRN} boleta={boletaSelected} handleGetBoletas={handleGetBoletas} page={currentPage} />}
            <FiltersRMP plate={plate} setPlate={setPlate} date={date} setDate={setDate} producerId={producerId} setProducerId={setProducerId} handleReset={handleReset} handleFilters={handleFilters} isOpen={isOpen} setIsOpen={setIsOpen} setBoletas={setBoletas} setProductId={setProductId} setFincaId={setFincaId} fincaId={fincaId} productId={productId} />
        </>
    )
}
