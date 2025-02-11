import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { useAppStore } from "../../../stores/useAppStore";
import Spinner from "../../../components/Spinner";

export default function IndexRMP() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [boletas, setBoletas] = useState<any[]>([]); // Estado para guardar los datos
    const getBoletasRMP = useAppStore((state) => state.getBoletasRMP);

    const handleGetInfo = async () => {
        setLoading(true); // Activar el spinner antes de la petición
        setError(false);  // Reiniciar el error

        try {
            const data = await getBoletasRMP(); // Obtener los datos
            setBoletas(data); // Guardar en el estado
        } catch (error) {
            setError(true);
            toast.error('Hubo un error al traer la información');
        } finally {
            setLoading(false); // Desactivar el spinner
        }
    };

    useEffect(() => {
        handleGetInfo();
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

                <div className="p-2 h-96 overflow-y-auto mt-10">
                    {loading && <Spinner />} 

                     {!loading && error && (
                        <p className="text-red-500 font-bold">Error al cargar los datos</p>
                    )}

                    {!loading && !error && (
                        <table className="table">
                            <thead>
                                <tr className="thead-tr">
                                    <th scope="col" className="thead-th">ID</th>
                                    <th scope="col" className="thead-th">Placa</th>
                                    <th scope="col" className="thead-th">Producto</th>
                                    <th scope="col" className="thead-th">Variedad</th>
                                    <th scope="col" className="thead-th">Coordinador</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    )
}
