import { EditIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import { Boleta } from "../../../types";

export default function IndexRMP() {
    const status: { [key: number]: string } = {
        1: 'Pendiente de Recepción',
        2: 'Pendiente de Revision Calidad'
    }

    const [loading, setLoading] = useState<boolean>(false);
    const [boletas, SetBoletas] = useState<Boleta[]>([]);
    const [role, setRole] = useState<string>();
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
                                        <td className="tbody-td"><span className="button bg-orange-500 text-sm">{status[boleta.status]}</span></td>
                                        <td className="tbody-td flex gap-5">
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

                                            {/* <Eye /> */}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </>
    )
}
