import { PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
export default function IndexVarieties() {
    return (
        <>
            <div>
                <h2 className="font-bold text-4xl">Variedades de Productos</h2>

                <div className="flex flex-row justify-end gap-5 mb-5">

                    <div className="flex flex-row justify-end gap-5">
                        <Link
                            to="/products-info/varieties"

                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                        >
                            <PlusIcon className="w-8" />
                            <p>Crear defectos</p>
                        </Link>
                    </div>

                    <Link
                            to="/products-info/varieties"

                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                        >
                            <PlusIcon className="w-8" />
                            <p>Crear Variedad</p>
                        </Link>

                    <div className="flex flex-row justify-end gap-5">
                        <Link
                            to="/products-info/varietiesDefects" 

                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 uppercase flex justify-center items-center"
                        >
                            <PlusIcon className="w-8" />
                            <p>Crear defectos de Variedad</p>
                        </Link>
                    </div>
                </div>

                <div className="p-2 h-96 overflow-y-auto mt-10">

                    <table className="table">
                        <thead>
                            <tr className="thead-tr">
                                <th scope="col" className="thead-th">ID</th>
                                <th scope="col" className="thead-th">Variedad</th>
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
