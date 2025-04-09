import { usePermissions } from "@/hooks/usePermissions";
import { WeeklyPlan } from "@/types";
import { Link } from "react-router-dom";

export default function ActionsColumns({ plan }: { plan: WeeklyPlan }) {
    const { hasPermission } = usePermissions();

    return (
        <td className="tbody-td w-1/5">
            {(hasPermission("assign people fincas")) && (
                <Link
                    to={`/planes-semanales/${plan.finca}/${plan.id}`}
                    className={`button flex justify-center w-2/3 bg-indigo-500 hover:bg-indigo-600 text-base rounded-lg`}
                >
                    Tareas
                </Link>
            )}
        </td>
    );
}
