import { usePermissions } from "@/hooks/usePermissions";
import { Link } from "react-router-dom";
import { WeeklyPlan } from "types/planificacionFincasType";

export default function ActionsColumns({ plan }: { plan: WeeklyPlan }) {
    const { hasPermission } = usePermissions();

    return (
        <td className="tbody-td">
            {(hasPermission("assign people fincas")) && (
                <Link
                    to={`/planes-semanales/${plan.finca}/${plan.id}`}
                    className={`button flex justify-center bg-indigo-500 hover:bg-indigo-600 text-base rounded-lg`}
                >
                    Tareas
                </Link>
            )}
        </td>
    );
}
