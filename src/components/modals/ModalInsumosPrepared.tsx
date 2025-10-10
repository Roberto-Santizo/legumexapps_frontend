import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getTasksByDate } from "@/api/WeeklyPlansAPI";
import { useEffect, useState } from "react";
import { getLotes } from "@/api/LotesAPI";
import { getTasks } from "@/api/TasksAPI";
import { FiltersTasksInitialValues } from "@/views/agricola/tasks/Index";
import { Trash2Icon } from "lucide-react";
import { TaskGeneral } from "@/types/taskGeneralType";
import Modal from "../Modal";
import TaskByDate from "../tareas-lote-plan/TaskByDate";
import Spinner from "../utilities-components/Spinner";
import ShowErrorAPI from "../utilities-components/ShowErrorAPI";
import Select from "react-select";
import { Lote } from "@/types/lotesType";


type Props = {
    id: string;
}

export default function ModalInsumosPrepared({ id }: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date')!;
    const show = date ? true : false;
    const params = useParams();
    const fincaId = params.finca_id!!;

    const [lotes, setLotes] = useState<Lote[]>([]);
    const [tareas, setTareas] = useState<TaskGeneral[]>([]);
    const [loteId, setLoteId] = useState<string>('');
    const [taskId, setTaskId] = useState<string>('');


    const results = useQueries({
        queries: [
            { queryKey: ['getLotes'], queryFn: () => getLotes({ page: 1, filters: { name: "", cdp: "", finca_id: fincaId }, paginated: '' }) },
            { queryKey: ['getTasks'], queryFn: () => getTasks({ page: 1, filters: FiltersTasksInitialValues, paginated: '' }) },
        ]
    })

    useEffect(() => {
        if (results[0].data) setLotes(results[0].data.data)
        if (results[1].data) setTareas(results[1].data.data)
    }, [results])

    const lotesOptions = lotes.map((lote) => ({
        value: lote.id,
        label: lote.name,
    }));

    const tareasOptions = tareas.map((lote) => ({
        value: lote.id,
        label: `${lote.code} ${lote.name}`,
    }));

    const { data: tasks, isLoading, isError, refetch } = useQuery({
        queryKey: ['getTasksByDate', id, date, loteId, taskId],
        queryFn: () => getTasksByDate({ id, date, loteId, taskId }),
        enabled: !!date
    });

    const handleCloseModal = () => {
        navigate(location.pathname, { replace: true });
        setLoteId('');
        setTaskId('');
    }

    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Preparación de insumos">
            <div className="p-10 space-y-5 mb-10">
                <div className='flex flex-row justify-between mt-4 gap-5 text-xs'>
                    <Select
                        options={lotesOptions}
                        className="react-select-container flex-1"
                        classNamePrefix="react-select"
                        onChange={(selected => {
                            if (selected?.value) {
                                setLoteId(selected?.value)
                            }
                        })}
                        placeholder="--SELECCIONE UN LOTE--"
                    />

                    <Select
                        options={tareasOptions}
                        className="react-select-container flex-1"
                        classNamePrefix="react-select"
                        onChange={(selected => {
                            if (selected?.value) {
                                setTaskId(selected?.value)
                            }
                        })}
                        placeholder="--SELECCIONE UNA TAREA--"
                    />

                    <Trash2Icon className="hover:text-gray-400 cursor-pointer"
                        onClick={() => {
                            setTaskId('');
                            setLoteId('');
                        }}
                    />
                </div>

                <div className="max-h-96 overflow-y-auto scrollbar-hide space-y-5">
                    {isLoading && <Spinner />}
                    {isError && <ShowErrorAPI />}
                    {tasks?.length === 0 ? (
                        <p className="text-center">No existen tareas planificadas para este día</p>
                    ) : (
                        <>
                            {tasks?.map(task => (
                                <TaskByDate key={task.id} task={task} refetch={refetch} />
                            ))}

                        </>
                    )}
                </div>
            </div>
        </Modal>
    )
}
