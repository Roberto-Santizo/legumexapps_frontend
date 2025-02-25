
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";

export default function IndexCamion() {

    return (
        <div>
            <div className="flex flex-row justify-end gap-5">
                <Link
                    to="/transporte/boleta"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                >
                    <PlusIcon className="w-8" />
                    <p>Crear Boleta de Camion</p>
                </Link>
            </div>

            <div className="p-2 h-96 overflow-y-auto mt-10">
                <table className="table">
                    <thead>
                        <tr className="thead-tr">
                            <th scope="col" className="thead-th uppercase">Planta</th>
                            <th scope="col" className="thead-th uppercase">Tipo de camión</th>
                            <th scope="col" className="thead-th">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <td className="tbody-td"></td>
                        <td className="tbody-td"></td>
                        <td className="tbody-td"></td>
                    </tbody>
                </table>
            </div>
        </div>

    )
}
