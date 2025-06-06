import { WeeklyPlan } from "@/api/WeeklyPlansAPI";
import { formatearQuetzales } from "@/helpers";
import { usePermissions } from "@/hooks/usePermissions";

export default function BudgetColumns({ plan }: { plan: WeeklyPlan }) {
    const { hasPermission } = usePermissions();

    if (!hasPermission("see budget")) {
        return (
            <>
                <td className="tbody-td" />
                <td className="tbody-td" />
            </>
        );
    }

    return (
        <>
            <td className="tbody-td font-bold text-green-500">
                {`${formatearQuetzales(plan.used_budget)}/${formatearQuetzales(plan.total_budget)}`}
            </td>
            <td className="tbody-td font-bold text-green-500">
                {`${formatearQuetzales(plan.used_total_budget_ext)}/${formatearQuetzales(plan.total_budget_ext)}`}
            </td>
        </>
    );
}
