import { useEffect, useState } from "react";
import { useAppStore } from "../../../stores/useAppStore"
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";

export default function IndexRMP() {
    const [loading, setLoading] = useState<boolean>(false);
    const getBoletasRMP = useAppStore((state) => state.getBoletasRMP);

    const handleGetInfo = async () => {
        try {
            await getBoletasRMP();
        } catch (error) {
            toast.error('Hubo un error al traer la información');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetInfo();
    }, []);

    return (
        <>
            <h2 className="font-bold text-3xl">Boletas Recepción de Materia Prima</h2>

            {loading && <Spinner />}
            {!loading && (
                <table className="table mt-10">
                    <thead>
                        <tr className="thead-tr">
                            <th scope="col" className="thead-th">
                                ID
                            </th>
                            <th scope="col" className="thead-th">
                                Placa
                            </th>
                            <th scope="col" className="thead-th">
                                Producto
                            </th>
                            <th scope="col" className="thead-th">
                                Variedad
                            </th>
                            <th scope="col" className="thead-th">
                                Coordinador
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            )}

        </>
    )
}
