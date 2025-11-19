import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TaskProductionOperationDate } from "@/types/taskProductionPlanTypes";
import { usePermissions } from "@/hooks/usePermissions";
import { DraftPackingMaterialTransactionItem } from "@/views/bodega/transactions/types/types";
import MenuTaskProductionActions from "../planes-semanales-produccion/MenuTaskProductionActions";
import ModalEntregaMaterialEmpaque from "@/views/bodega/transactions/components/ModalEntregaMaterialEmpaque";

type Props = {
    task: TaskProductionOperationDate;
}

export default function TaskScheduled({ task }: Props) {
    const { hasPermission } = usePermissions();
    const [modalEntrega, setModalEntrega] = useState<boolean>(false);
    const [items, setItems] = useState<DraftPackingMaterialTransactionItem[]>(task.recipe);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('changeOperationTask', task.id);

    const navigate = useNavigate();

    const handleClickStatus = () => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("changeStatus", task.id);
        navigate(`${location.pathname}?${searchParams.toString()}`);
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 transition hover:shadow-md">
            <div className="p-6 space-y-5 text-gray-700">
                <div className="grid md:grid-cols-2 gap-6 items-start text-sm xl:text-base">
                    <div className="space-y-3">
                        <p>
                            <span className="font-semibold text-gray-900">SKU:</span>{" "}
                            <span className="text-gray-600">{task.sku}</span>
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900">Producto:</span>{" "}
                            <span className="text-gray-600">{task.product}</span>
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900">Línea:</span>{" "}
                            <span className="text-gray-600">{task.line}</span>
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900">Total libras:</span>{" "}
                            <span className="text-gray-600">{task.total_lbs}</span>
                        </p>
                        <p>
                            <span className="font-semibold text-gray-900">Destino:</span>{" "}
                            <span className="text-gray-600">{task.destination}</span>
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <MenuTaskProductionActions task={task} setModalEntrega={setModalEntrega} />
                    </div>
                </div>
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-gray-100">
                {hasPermission("change task production status") ? (
                    <button
                        onClick={() => handleClickStatus()}
                        className={`text-sm px-5 py-1.5 rounded-full font-semibold transition 
                        ${task.color} bg-opacity-10 border 
                        ${task.color.replace("text-", "border-")} 
                        hover:bg-opacity-20`}
                    >
                        {task.status}
                    </button>
                ) : (
                    <p
                        className={`text-sm px-5 py-1.5 rounded-full font-semibold transition 
                        ${task.color} bg-opacity-10 border 
                        ${task.color.replace("text-", "border-")} 
                        hover:bg-opacity-20`}
                    >
                        {task.status}
                    </p>
                )}

            </div>

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
