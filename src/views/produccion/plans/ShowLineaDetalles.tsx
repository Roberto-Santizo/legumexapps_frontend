import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTasksByLineId } from "@/api/TaskProductionPlansAPI";
import ShowErrorAPI from "@/components/utilities-components/ShowErrorAPI";
import TaskProduction from "@/components/produccion/TaskProduction";
import ModalUnassignNote from "@/components/modals/ModalUnassignNote";
import ModalTomaRendimientoProduccion from "@/components/modals/ModalTomaRendimientoProduccion";
import ModalTiempoMuerto from "@/components/modals/ModalTiempoMuerto";
import ModalCierreTareaProduccion from "@/components/modals/ModalCierreTareaProduccion";
import ModalNotasProblemas from "@/components/modals/ModalNotasProblemas";
import TaskProductionSkeleton from "@/components/produccion/TaskProductionSkeleton";

export default function ShowLineaDetalles() {
    const params = useParams();
    const plan_id = params.plan_id!!;
    const linea_id = params.linea_id!!;

    const { data: tasks, isLoading, isError } = useQuery({
        queryKey: ['getTasksByLineId', plan_id, linea_id],
        queryFn: () => getTasksByLineId(plan_id, linea_id),
    });

    if (isLoading) return <TaskProductionSkeleton />;
    if (isError) return <ShowErrorAPI />;
    if (tasks) return (
        <div>
            <h1 className="font-bold text-xl text-center xl:text-left xl:text-4xl">Detalles de Linea</h1>
            {(tasks.length === 0) && (
                <p className=" text-center text-3xl font-medium mt-10">No existen tareas para esta fecha</p>
            )}

            <div className="space-y-5">
                {tasks.map(task => (
                    <TaskProduction key={task.id} task={task} />
                ))}
            </div>

            <ModalTomaRendimientoProduccion />

            <ModalCierreTareaProduccion />

            <ModalTiempoMuerto />

            <ModalNotasProblemas />

            <ModalUnassignNote />
        </div>
    )
}
