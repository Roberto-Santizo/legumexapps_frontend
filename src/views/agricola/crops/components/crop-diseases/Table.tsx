import { CropDisease } from "../../types";
import { EyeIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

type Props = {
    data: CropDisease[];
}

export default function Table({ data }: Props) {
    const params = useParams();
    const id = params.id!

    return (
        <table className="table mt-10">
            <thead>
                <tr className="thead-tr">
                    <th scope="col" className="thead-th">
                        Enfermedad
                    </th>
                    <th scope="col" className="thead-th">
                        Semana
                    </th>
                    <th scope="col" className="thead-th">
                        Acción
                    </th>
                </tr>
            </thead>

            <tbody>
                {data.map((disease) => (
                    <tr className="tbody-tr" key={disease.id}>
                        <td className="tbody-td">{disease.name}</td>
                        <td className="tbody-td">{disease.week}</td>
                        <td className="tbody-td">
                            <Link className="hover:text-gray-600" to={`/cultivos/enfermedades/${id}/${disease.id}`}>
                                <EyeIcon />
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
