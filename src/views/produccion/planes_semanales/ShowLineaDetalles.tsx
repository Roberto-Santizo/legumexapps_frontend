import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTasksByLineId, TaskByLine } from "@/api/WeeklyProductionPlanAPI";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import ShowErrorAPI from "@/components/ShowErrorAPI";
import TaskProduction from "@/components/TaskProduction";
import ModalCierreTareaProduccion from "@/components/ModalCierreTareaProduccion";
import ModalTomaRendimientoProduccion from "@/components/ModalTomaRendimientoProduccion";
import ModalTiempoMuerto from "@/components/ModalTiempoMuerto";

export default function ShowLineaDetalles() {
    const params = useParams();
    const plan_id = params.plan_id!!;
    const linea_id = params.linea_id!!;
    const [selectedTask, setSelectedTask] = useState<TaskByLine>({} as TaskByLine);
    const [modalCierre, setModalCierre] = useState<boolean>(false);
    const [modalRendimiento, setModalRendimiento] = useState<boolean>(false);
    const [modalTimeout, setModalTimeout] = useState<boolean>(false);

    const { data: tasks, isLoading, isError, refetch } = useQuery({
        queryKey: ['getTasksByLineId', plan_id, linea_id],
        queryFn: () => getTasksByLineId(plan_id, linea_id)
    });

    if (isLoading) return <Spinner />;
    if (isError) return <ShowErrorAPI />;
    if (tasks) return (
        <div>
            <h1 className="font-bold text-4xl">Detalles de Linea</h1>
            {(tasks.length === 0) && (
                <p className=" text-center text-3xl font-medium mt-10">No existen tareas para esta fecha</p>
            )}
            {tasks.map(task => (
                <TaskProduction key={task.id} task={task} setModalTimeOut={setModalTimeout} setSelectedTask={setSelectedTask} setModalCierre={setModalCierre} modalCierre={modalCierre} setModalRendimiento={setModalRendimiento} />
            ))}


            {(modalCierre) && (
                <ModalCierreTareaProduccion task={selectedTask} setModalCierre={setModalCierre} modal={modalCierre} refetch={refetch} setSelectedTask={setSelectedTask} />
            )}

            {(modalRendimiento) && (
                <ModalTomaRendimientoProduccion task={selectedTask} setModal={setModalRendimiento} modal={modalRendimiento} setSelectedTask={setSelectedTask} />
            )}

            {(modalTimeout) && (
                <ModalTiempoMuerto modal={modalTimeout} task={selectedTask} setModalTimeout={setModalTimeout} setSelectedTask={setSelectedTask}/>
            )}
        </div>
    )
}
