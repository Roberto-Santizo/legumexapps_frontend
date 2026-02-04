import { Link } from "react-router-dom";
import { Crop } from "../../types";

type Props = {
    id: Crop['id'];
}

export default function TableNavegation({ id }: Props) {
    return (
        <div className="flex gap-5">
            <Link to={`/cultivos/enfermedades/${id}`} className="button bg-indigo-600 hover:bg-indigo-800">
                Enfermemdades
            </Link>

            <Link to={`/cultivos/partes/${id}`} className="button bg-orange-600 hover:bg-orange-800">
                Partes
            </Link>
        </div>
    )
}
