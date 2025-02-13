import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function IndexDefectos() {
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

            <div className="mt-10">
                <table className="table">
                    <thead>
                        <tr className="thead-tr">
                            <th scope="col" className="thead-th">ID</th>
                            <th scope="col" className="thead-th">Defecto</th>
                            <th scope="col" className="thead-th">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </>
    )
}
