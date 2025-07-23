import { BoxIcon, Calendar, EyeIcon, File } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { TaskProductionOperationDate } from "types/taskProductionPlanTypes";
import { usePermissions } from "@/hooks/usePermissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ModalChangeOperationDate from "../modals/ModalChangeOperationDate";
import ModalEntregaMaterialEmpaque, { DraftPackingMaterialTransactionItem } from "../modals/ModalEntregaMaterialEmpaque";
import { UnAssignTaskProduction } from "@/api/TaskProductionPlansAPI";
import { toast } from "react-toastify";
import { useAppStore } from "@/store";

type Props = {
    task: TaskProductionOperationDate;
}

export default function TaskScheduled({ task }: Props) {
    const [modalEntrega, setModalEntrega] = useState<boolean>(false);
    const { hasPermission } = usePermissions();
    const [items, setItems] = useState<DraftPackingMaterialTransactionItem[]>(task.recipe);
    const location = useLocation();

    const params = useParams();
    const plan_id = params.plan_id!!;
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('changeOperationTask', task.id);
    const date = queryParams.get('date') ?? '';
    const queryClient = useQueryClient();
    const filters = useAppStore((state) => state.filtersWithOperationDate);
    const filtersNoOperationDate = useAppStore((state) => state.filtersNoOperationDate);

    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: UnAssignTaskProduction,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', plan_id, date, filters] });
            queryClient.invalidateQueries({ queryKey: ['getTasksNoOperationDate', plan_id, filtersNoOperationDate], });
        }
    });

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 transition hover:shadow-lg">
            <div className="p-6 space-y-3 text-gray-700">
                <div className="flex flex-col xl:flex-row justify-between items-center gap-5 text-xs xl:text-base">
                    <div className="space-y-1">
                        <p><span className="font-semibold text-gray-900">SKU:</span> {task.sku}</p>
                        <p><span className="font-semibold text-gray-900">Producto:</span> {task.product}</p>
                        <p><span className="font-semibold text-gray-900">Línea:</span> {task.line}</p>
                        <p><span className="font-semibold text-gray-900">Total libras:</span> {task.total_lbs}</p>
                        <p><span className="font-semibold text-gray-900">Destino:</span> {task.destination}</p>
                    </div>
                    <div>
                        <span className={`inline-block rounded-full text-xs px-3 py-1 font-semibold ${task.color} bg-opacity-10 border ${task.color.replace("text-", "border-")}`}>
                            {task.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-5">
                {(!task.finished && !task.working && hasPermission('administrate plans production') && (Number(task.status_id) < 3)) && (
                    <>
                        <button
                            onClick={() => {
                                navigate(`${location.pathname}?${queryParams.toString()}`)
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:shadow-sm"
                        >
                            <Calendar className="w-4 h-4" />
                            <p className="hidden xl:inline-block">
                                Cambiar fecha de operación
                            </p>
                        </button>

                        <button
                            onClick={() => {
                                mutate({ taskId: task.id });
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:shadow-sm"
                        >
                            <Calendar className="w-4 h-4" />
                            <p className="hidden xl:inline-block">
                                Desasignar
                            </p>
                        </button>
                    </>
                )}

                {(hasPermission('create mp transactions')) && (
                    <>
                        {(task.status_id === '1' && task.recipe.length > 0) && (
                            <button
                                onClick={() => {
                                    setModalEntrega(true);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:shadow-sm"
                            >
                                <BoxIcon className="w-4 h-4" />
                                <p className="hidden xl:inline-block">
                                    Entregar Material de Empaque
                                </p>
                            </button>
                        )}

                        <button
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:shadow-sm"
                            onClick={() => navigate(`/material-empaque-transacciones/crear?taskId=${task.id}`, { state: { url: location.pathname + location.search } })}
                        >
                            <File className="w-4 h-4" />
                            <p className="hidden xl:inline-block">
                                Crear Transacción de Material Empaque
                            </p>
                        </button>

                    </>
                )}

                {(task.status_id === '4') && (
                    <Link to={`/planes-produccion/informacion/${task.id}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:shadow-sm">
                        <EyeIcon className="hover:text-gray-400" />
                        <p className="hidden xl:inline-block">Ver detalles</p>
                    </Link>
                )}

                {(task.status_id === '5') && (
                    <Link to={`/planes-produccion/tarea-produccion/${task.id}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:shadow-sm">
                        <EyeIcon className="hover:text-gray-400" />
                        <p>Ver detalles</p>
                    </Link>
                )}
            </div>

            <ModalChangeOperationDate />

            {task.recipe?.length > 0 && (
                <ModalEntregaMaterialEmpaque
                    modal={modalEntrega}
                    setModal={setModalEntrega}
                    task={task}
                    items={items}
                    setItems={setItems}
                />
            )}

        </div>
    );
}
