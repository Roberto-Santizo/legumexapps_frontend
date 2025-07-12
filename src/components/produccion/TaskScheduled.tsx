import { BoxIcon, Calendar, EyeIcon, File } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TaskProductionOperationDate } from "types/taskProductionPlanTypes";
import { usePermissions } from "@/hooks/usePermissions";
import ModalChangeOperationDate from "../modals/ModalChangeOperationDate";
import ModalEntregaMaterialEmpaque, { DraftPackingMaterialTransactionItem } from "../modals/ModalEntregaMaterialEmpaque";

type Props = {
    task: TaskProductionOperationDate;
}

export default function TaskScheduled({ task }: Props) {
    const [modalEntrega, setModalEntrega] = useState<boolean>(false);
    const { hasPermission } = usePermissions();
    const [items, setItems] = useState<DraftPackingMaterialTransactionItem[]>(task.recipe);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('changeOperationTask', task.id);

    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 transition hover:shadow-lg">
            <div className="p-6 space-y-3 text-gray-700">
                <div className="flex justify-between items-start">
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

            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-2">
                {(!task.finished && !task.working && hasPermission('administrate plans production') && (Number(task.status_id) < 3)) && (
                    <button
                        onClick={() => {
                            navigate(`${location.pathname}?${queryParams.toString()}`)
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:shadow-sm"
                    >
                        <Calendar className="w-4 h-4" />
                        Cambiar fecha de operación
                    </button>
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
                                Entregar Material de Empaque
                            </button>
                        )}

                        <button
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:shadow-sm"
                            onClick={() => navigate(`/material-empaque-transacciones/crear?taskId=${task.id}`, { state: { url: location.pathname + location.search } })}
                        >
                            <File className="w-4 h-4" />
                            Crear Transacción de Material Empaque
                        </button>

                    </>
                )}

                {(task.status_id === '4') && (
                    <Link to={`/planes-produccion/informacion/${task.id}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:shadow-sm">
                        <EyeIcon className="hover:text-gray-400" />
                        <p>Ver detalles</p>
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
