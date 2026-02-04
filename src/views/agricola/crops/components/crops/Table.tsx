import { Crop } from "../../types";
import TableNavegation from "./TableNavegation";

type Props = {
    data: Crop[];
}

export default function Table({ data }: Props) {
    return (
        <table className="table mt-10">
            <thead>
                <tr className="thead-tr">
                    <th scope="col" className="thead-th">
                        Cultivo
                    </th>
                    <th scope="col" className="thead-th">
                        Código
                    </th>
                    <th scope="col" className="thead-th">
                        Acción
                    </th>
                </tr>
            </thead>
            <tbody>
                {data.map((crop) => (
                    <tr className="tbody-tr" key={crop.id}>
                        <td className="tbody-td">{crop.name}</td>
                        <td className="tbody-td">{crop.code}</td>
                        <td className="tbody-td">
                            <TableNavegation id={crop.id} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
