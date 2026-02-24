import { getLotes } from "@/api/LotesAPI";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../utilities-components/Spinner";

export default function LotesValidation() {
    const { data: lotes, isLoading } = useQuery({
        queryKey: ['getPaginatedLotes', 1],
        queryFn: () => getLotes({ page: 1, filters: { name: "", cdp: "", finca_id: "" }, paginated: '' }),
    });

    if (isLoading) return <Spinner />

    if (lotes) return (
        <div className="flex flex-col items-center shadow-xl row-start-6 col-start-1 col-span-12 rounded-xl gap-5">
            <p className="uppercase w-full text-center bg-gray-400 p-3 text-white font-bold rounded-t-xl text-2xl">
                Validación de Lotes
            </p>

            <div className="w-full p-2">
                <div className="max-h-64 overflow-y-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr className="thead-tr">
                                <th scope="col" className="thead-th">Finca</th>
                                <th scope="col" className="thead-th">Lote</th>
                                <th scope="col" className="thead-th">Ultima Validación</th>
                                <th scope="col" className="thead-th">Validado Por</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lotes?.data.map((lote) => (
                                <tr className="tbody-tr" key={lote.id}>
                                    <td className="tbody-td">{lote.finca}</td>
                                    <td className="tbody-td">{lote.name}</td>
                                    <td className="tbody-td">{lote.date}</td>
                                    <td className="tbody-td">{lote.validation_by}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
