import { EditIcon, Eye, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useAppStore } from "@/stores/useAppStore";
import { Boleta } from "@/types";
import Spinner from "@/components/Spinner";
import BoletaGRNModal from "@/components/boleta-rmp/BoletaGRNModal";

export default function IndexRMP() {
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

    const [loading, setLoading] = useState<boolean>(false);
    const [boletas, SetBoletas] = useState<Boleta[]>([]);
    const [role, setRole] = useState<string>();
    const [modalGRN, setModalGRN] = useState<boolean>(false);
    const [boletaSelected, setBoletaSelected] = useState<Boleta>();
    const getBoletasRMP = useAppStore((state) => state.getBoletasRMP);
    const getUserRoleByToken = useAppStore((state) => state.getUserRoleByToken);

    const handleGetBoletas = async () => {
        setLoading(true);
        try {
            const data = await getBoletasRMP();
            SetBoletas(data.data);
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
        handleGetBoletas();
        handleGetUserRole();
    }, []);
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
                {(loading && !role) ? <Spinner /> : (
                    <div className="p-2 h-96 overflow-y-auto mt-10">
                        <table className="table">
                            <thead>
                                <tr className="thead-tr">
                                    <th scope="col" className="thead-th">ID</th>
                                    <th scope="col" className="thead-th">Placa</th>
                                    <th scope="col" className="thead-th">Producto</th>
                                    <th scope="col" className="thead-th">Variedad</th>
                                    <th scope="col" className="thead-th">Coordinador</th>
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
                                        <td className="tbody-td">{boleta.variety}</td>
                                        <td className="tbody-td">{boleta.coordinator}</td>
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
                    </div>
                )}
            </div>

            {boletaSelected && <BoletaGRNModal modal={modalGRN} setModal={setModalGRN} boleta={boletaSelected} handleGetBoletas={handleGetBoletas} />}
        </>
    )
}
