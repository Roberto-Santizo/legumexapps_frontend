import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLineaById } from "@/api/LineasAPI";
import { FileUp } from "lucide-react";
import { useState } from "react";
import ModalCargaPosicionesLinea from "@/components/modals/ModalCargaPosicionesLinea";
import Spinner from "@/components/utilities-components/Spinner";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";

export default function PosicionesLinea() {
    const params = useParams();
    const line_id = params.id!!;

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { data: line, isLoading, isError } = useQuery({
        queryKey: ['getLineaById', line_id],
        queryFn: () => getLineaById(line_id)
    });

    if (isLoading) return <Spinner />
    if (isError) return <ShowErrorAPI />
    if (line) return (
        <div>
            <h2 className="font-bold text-4xl">Posiciones de linea {line.name}</h2>

            <div className="mt-5 p-5 shadow grid grid-cols-2">
                <div>
                    <h3 className="font-bold text-2xl">Información de linea</h3>
                    <p className="text-xl"><span className="font-bold">Codigo de linea:</span> {line.code}</p>
                    <p className="text-xl"><span className="font-bold">Turno:</span> {line.shift}</p>
                </div>

                <div className="flex gap-2 font-bold text-2xl justify-center items-center cursor-pointer hover:text-gray-500" onClick={() => setIsOpen(true)}>
                    <FileUp />
                    <p>Actualizar Posiciones</p>
                </div>
            </div>

            <div className="w-full p-2 h-96 overflow-y-scroll scrollbar-hide">

                <table className="table mt-10">
                    <thead>
                        <tr className="thead-tr">
                            <th className="thead-th">Posición</th>
                        </tr>
                    </thead>
                    <tbody>
                        {line?.positions?.map(position => (
                            <tr className="tbody-tr" key={position.id}>
                                <td className="tbody-td">{position.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <ModalCargaPosicionesLinea isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    )
}
