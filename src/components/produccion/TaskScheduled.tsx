import { BoxIcon, Calendar, EditIcon, EyeIcon, File, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { TaskProductionOperationDate } from "types/taskProductionPlanTypes";
import { usePermissions } from "@/hooks/usePermissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ModalChangeOperationDate from "../modals/ModalChangeOperationDate";
import ModalEntregaMaterialEmpaque, { DraftPackingMaterialTransactionItem } from "../modals/ModalEntregaMaterialEmpaque";
import { deleteTaskProductionAssignments, UnAssignTaskProduction } from "@/api/TaskProductionPlansAPI";
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

    const { mutate: deleteAssigments } = useMutation({
        mutationFn: deleteTaskProductionAssignments,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: ['getTasksOperationDate', plan_id, date, filters] });
        }
    });

    const handleEditClick = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("editTask", task.id);
        navigate(`${location.pathname}?${searchParams.toString()}`);
    };

    return (
        <div className="bg-white rounded-2xl shadow border border-gray-200 transition hover:shadow-lg">
            <div className="p-6 space-y-4 text-gray-700">
                <div className="grid xl:grid-cols-2 gap-6 items-start text-sm xl:text-base">
                    <div className="space-y-2">
                        <p><span className="font-medium text-gray-900">SKU:</span> {task.sku}</p>
                        <p><span className="font-medium text-gray-900">Producto:</span> {task.product}</p>
                        <p><span className="font-medium text-gray-900">Línea:</span> {task.line}</p>
                        <p><span className="font-medium text-gray-900">Total libras:</span> {task.total_lbs}</p>
                        <p><span className="font-medium text-gray-900">Destino:</span> {task.destination}</p>
                    </div>

                    <div className="flex xl:justify-end items-center">
                        <span className={`text-sm px-4 py-1 rounded-full font-semibold ${task.color} bg-opacity-10 border ${task.color.replace("text-", "border-")}`}>
                            {task.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-end gap-3 xl:gap-5">
                {(Number(task.status_id) === 1 && hasPermission('administrate plans production')) && (
                    <button
                        onClick={() => mutate({ taskId: task.id })}
                        className="action-btn"
                    >
                        <Calendar className="w-4 h-4" />
                        <span className="hidden xl:inline">Desasignar</span>
                    </button>

                )}

                {(!task.finished && !task.working && hasPermission('administrate plans production') && Number(task.status_id) < 3) && (
                    <>
                        <button
                            onClick={() => navigate(`${location.pathname}?${queryParams.toString()}`)}
                            className="action-btn"
                        >
                            <Calendar className="w-4 h-4" />
                            <span className="hidden xl:inline">Cambiar fecha de operación</span>
                        </button>

                        {hasPermission('delete assignments') && task.has_employees && (
                            <button
                                onClick={() => deleteAssigments({ taskId: task.id })}
                                className="action-btn"
                            >
                                <TrashIcon className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                                <span>Eliminar Asignaciones</span>
                            </button>
                        )}
                    </>
                )}

                {hasPermission('create mp transactions') && (
                    <>
                        {task.status_id === '1' && task.recipe.length > 0 && (
                            <button
                                onClick={() => setModalEntrega(true)}
                                className="action-btn"
                            >
                                <BoxIcon className="w-4 h-4" />
                                <span className="hidden xl:inline">Entregar Material de Empaque</span>
                            </button>
                        )}

                        <button
                            onClick={() => navigate(`/material-empaque-transacciones/crear?taskId=${task.id}`, {
                                state: { url: location.pathname + location.search },
                            })}
                            className="action-btn"
                        >
                            <File className="w-4 h-4" />
                            <span className="hidden xl:inline">Crear Transacción de Material Empaque</span>
                        </button>
                    </>
                )}

                {task.status_id === '4' && (
                    <Link
                        to={`/planes-produccion/informacion/${task.id}`}
                        className="action-btn"
                    >
                        <EyeIcon className="w-4 h-4" />
                        <span className="hidden xl:inline">Ver detalles</span>
                    </Link>
                )}

                {task.status_id === '5' && (
                    <Link
                        to={`/planes-produccion/tarea-produccion/${task.id}`}
                        className="action-btn"
                    >
                        <EyeIcon className="w-4 h-4" />
                        <span>Ver detalles</span>
                    </Link>
                )}

                {hasPermission('edit production task') && (
                    <button
                        onClick={() => handleEditClick()}
                        className="action-btn"
                    >
                        <EditIcon className="w-4 h-4" />
                        <span className="hidden xl:inline">Editar Tarea</span>
                    </button>
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
