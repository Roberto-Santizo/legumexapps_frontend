import { downloadReportInsumos } from "@/api/WeeklyPlansAPI";
import { usePermissions } from "@/hooks/usePermissions";
import { WeeklyPlan } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Sheet } from "lucide-react";
import { toast } from "react-toastify";
import LoadingOverlay from "../utilities-components/LoadingOverlay";

export default function InsumosColumns({ planId }: { planId: WeeklyPlan['id'] }) {
    const { hasPermission } = usePermissions();


    const { mutate, isPending } = useMutation({
        mutationFn: ({ planId }: { planId: WeeklyPlan['id'] }) => downloadReportInsumos(planId),
        onError: () => {
            toast.error('Hubo un error al descargar')
        }
    });

    const handleDownloadInsumosReport = async (planId: WeeklyPlan['id']) => { mutate({ planId }) };

    if (isPending) return <LoadingOverlay />
    return (
        <td className="tbody-td">
            {hasPermission("download insumos report") && (
                <button onClick={() => handleDownloadInsumosReport(planId)}>
                    <Sheet className="hover:text-gray-400" />
                </button>
            )}
        </td>
    );
}
