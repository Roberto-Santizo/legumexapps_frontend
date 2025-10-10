import { deleteTaskProductionDraft } from "@/api/DraftTaskProductionDraftAPI";
import { usePermissions } from "@/hooks/usePermissions";
import { useRole } from "@/hooks/useRole";
import { useMutation } from "@tanstack/react-query";
import { EditIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { tWeeklyProductionPlanDraftDetailsSchema } from "@/types/draftWeeklyProductionPlanTypes";

type Props = {
    draft: tWeeklyProductionPlanDraftDetailsSchema;
}

export default function TasksList({ draft }: Props) {
    const navigate = useNavigate();
    const { data: role } = useRole();
    const { hasPermission } = usePermissions();

    const { mutate } = useMutation({
        mutationFn: deleteTaskProductionDraft,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
        }
    });

    if (role) return (
        <ul className="space-y-4">
            {draft.tasks.map((task) => (
                <li
                    key={task.id}
                    className="p-4 bg-white rounded-xl border border-gray-200 shadow hover:shadow-md transition"
                >
                    <div className="space-y-2 text-sm">
                        <div>
                            <p className="text-gray-500">Línea</p>
                            <p className="text-gray-800 font-medium">{task.line}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">SKU</p>
                            <p className="text-gray-800 font-medium">{task.sku}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Producto</p>
                            <p className="text-gray-800 font-medium">{task.product_name}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Libras totales</p>
                            <p className="text-gray-800 font-medium">{task.total_lbs}</p>
                        </div>

                        <div>
                            <p className="text-gray-500">Destino</p>
                            <p className="text-gray-800 font-medium">{task.destination}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                        {hasPermission('update task draft') && (
                            <button className="flex justify-center items-center gap-5 button bg-indigo-500 hover:bg-indigo-600" onClick={() => navigate(`${location.pathname}?editDraftTask=${task.id}`)}>
                                <EditIcon className="cursor-pointer hover:text-indigo-500" size={18} />
                                <p>Editar Tarea</p>
                            </button>

                        )}

                        {hasPermission('delete task draft') && (
                            <button className="flex justify-center items-center gap-5 button bg-red-500 hover:bg-red-600" onClick={() => mutate({ id: task.id })}>
                                <TrashIcon
                                    className="cursor-pointer hover:text-red-500"
                                    size={18}
                                />
                                <p>Eliminar Tarea</p>
                            </button>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    )
}
