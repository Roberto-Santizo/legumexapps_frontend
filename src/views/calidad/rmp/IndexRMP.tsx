import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function IndexRMP() {
    return (
        <>
            <div>
                <h2 className="font-bold text-4xl">Boletas Recepción de Materia Prima</h2>

                <div className="flex flex-row justify-end gap-5">
                    <Link
                        to="/rmp/crearBoleta" //Aca Modifico para ver el funcionamiento de las vistas que creo
                        // /calidad/producers
                        // /calidad/inspectors

                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                    >
                        <PlusIcon className="w-8" />
                        <p>Crear Boleta Materia Prima</p>
                    </Link>
                </div>

                <div className="p-2 h-96 overflow-y-auto mt-10">

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
                </div>
            </div>
        </>
    )
}
