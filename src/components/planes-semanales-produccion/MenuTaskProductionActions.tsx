import { Boxes, BoxIcon, Calendar, EditIcon, EyeIcon, File, TrashIcon } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Dispatch, Fragment } from 'react';
import { Menu, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { usePermissions } from "@/hooks/usePermissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store";
import { toast } from "react-toastify";
import { TaskProductionOperationDate } from "types/taskProductionPlanTypes";
import { deleteTaskProductionAssignments, UnAssignTaskProduction } from "@/api/TaskProductionPlansAPI";

type Props = {
    task: TaskProductionOperationDate;
    setModalEntrega: Dispatch<React.SetStateAction<boolean>>;
}

export default function MenuTaskProductionActions({ task, setModalEntrega }: Props) {
    const { hasPermission } = usePermissions();

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

    const handleDevolutionClick = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("devolutionTaskId", task.id);
        navigate(`${location.pathname}?${searchParams.toString()}`);
    };

    return (
        <div className="">
            <Menu as="div" className="relative flex-none">
                <Menu.Button className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    <span className="sr-only">Opciones</span>
                    <EllipsisVerticalIcon className="h-7 w-7" aria-hidden="true" />
                </Menu.Button>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-150"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <MenuItems
                        className="absolute right-0 z-20 mt-2 w-80 origin-top-right rounded-2xl bg-white py-3 shadow-xl ring-1 ring-gray-900/10 focus:outline-none divide-y divide-gray-100"
                    >
                        <div className="space-y-1 px-2">
                            {(Number(task.status_id) === 1 && hasPermission('administrate plans production')) && (
                                <MenuItem>
                                    <button
                                        onClick={() => mutate({ taskId: task.id })}
                                        className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <Calendar className="w-5 h-5 text-blue-500" />
                                        <span>Desasignar</span>
                                    </button>
                                </MenuItem>
                            )}

                            {(!task.finished && !task.working && hasPermission('administrate plans production') && Number(task.status_id) < 3) && (
                                <>
                                    <MenuItem>
                                        <button
                                            onClick={() => navigate(`${location.pathname}?${queryParams.toString()}`)}
                                            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <Calendar className="w-5 h-5 text-green-500" />
                                            <span>Cambiar fecha de operación</span>
                                        </button>
                                    </MenuItem>

                                    {hasPermission('delete assignments') && task.has_employees && (
                                        <MenuItem>
                                            <button
                                                onClick={() => deleteAssigments({ taskId: task.id })}
                                                className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                                <span>Eliminar Asignaciones</span>
                                            </button>
                                        </MenuItem>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="space-y-1 px-2">
                            {hasPermission('create mp transactions') && (
                                <>
                                    {task.status_id === '1' && task.recipe.length > 0 && (
                                        <MenuItem>
                                            <button
                                                onClick={() => setModalEntrega(true)}
                                                className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                <BoxIcon className="w-5 h-5 text-indigo-500" />
                                                <span>Entregar Material de Empaque</span>
                                            </button>
                                        </MenuItem>
                                    )}

                                    <MenuItem>
                                        <button
                                            onClick={() => navigate(`/material-empaque-transacciones/crear?taskId=${task.id}`, {
                                                state: { url: location.pathname + location.search },
                                            })}
                                            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <File className="w-5 h-5 text-indigo-500" />
                                            <span>Crear Transacción de Material Empaque</span>
                                        </button>
                                    </MenuItem>
                                </>
                            )}
                        </div>

                        <div className="space-y-1 px-2">
                            {task.status_id === '4' && (
                                <MenuItem>
                                    <Link
                                        to={`/planes-produccion/informacion/${task.id}`}
                                        className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <EyeIcon className="w-5 h-5 text-blue-500" />
                                        <span>Ver detalles</span>
                                    </Link>
                                </MenuItem>
                            )}

                            {task.status_id === '5' && (
                                <MenuItem>
                                    <Link
                                        to={`/planes-produccion/tarea-produccion/${task.id}`}
                                        className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <EyeIcon className="w-5 h-5 text-blue-500" />
                                        <span>Ver detalles</span>
                                    </Link>
                                </MenuItem>
                            )}

                            {hasPermission('edit production task') && (
                                <MenuItem>
                                    <button
                                        onClick={() => handleEditClick()}
                                        className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <EditIcon className="w-5 h-5 text-yellow-500" />
                                        <span>Editar Tarea</span>
                                    </button>
                                </MenuItem>
                            )}

                            {(task.devolution && hasPermission('create mp transactions')) && (
                                <MenuItem>
                                    <button
                                        onClick={() => handleDevolutionClick()}
                                        className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <Boxes className="w-5 h-5 text-purple-500" />
                                        <span>Devolución de Material Empaque</span>
                                    </button>
                                </MenuItem>
                            )}
                        </div>
                    </MenuItems>
                </Transition>
            </Menu>
        </div>

    );
}
