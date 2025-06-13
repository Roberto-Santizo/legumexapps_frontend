import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Bars3Icon } from '@heroicons/react/16/solid';
import { Trash } from 'lucide-react';
import { changeOperationDate, getTasksForCalendar, getTasksNoPlanificationDate } from '@/api/TasksWeeklyPlanAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { getLotes, Lote } from '@/api/LotesAPI';
import { getTasks } from '@/api/TasksAPI';
import { FiltersTasksInitialValues } from '../tareas/IndexTareas';
import { TaskWeeklyPlanForCalendar } from 'types/taskWeeklyPlanTypes';
import Select from "react-select";
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import ModalChangeOperationDateAgricola from '@/components/modals/ModalChangeOperationDateAgricola';
import ModalInfoTareaLote from '@/components/modals/ModalInfoTareaLote';
import ModalInsumosPrepared from '@/components/modals/ModalInsumosPrepared';
import Spinner from '@/components/utilities-components/Spinner';
import TaskCalendarFincaComponent from '@/components/planes-semanales-finca/TaskCalendarFincaComponent';
import { TaskGeneral } from 'types/taskGeneralType';


type EventReceiveInfo = {
    event: {
        id: string;
        startStr: string;
    };
}

const CalendarComponent = () => {
    const queryClient = useQueryClient();
    const params = useParams();
    const id = params.plan_id!!;
    const fincaId = params.finca_id!!;

    const [ids, setIds] = useState<string[]>([]);
    const [seeTasks, setSeeTasks] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalInfoTarea, setModalInfoTarea] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskWeeklyPlanForCalendar>({} as TaskWeeklyPlanForCalendar);
    const [loteId, setLoteId] = useState<string>('');
    const [taskId, setTaskId] = useState<string>('');
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [tareas, setTareas] = useState<TaskGeneral[]>([]);
    const { hasPermission } = usePermissions();

    const calendarRef = useRef<FullCalendar | null>(null);
    const navigate = useNavigate();


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

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['getTasksNoPlanificationDate', id, loteId, taskId],
        queryFn: () => getTasksNoPlanificationDate({ id, loteId, taskId }),
    });

    const { data: tasksForCalendar } = useQuery({
        queryKey: ['getTasksForCalendar', id],
        queryFn: () => getTasksForCalendar(id),
    });

    const { mutate } = useMutation({
        mutationFn: changeOperationDate,
        onSuccess: (data) => {
            toast.success(data);
            setModal(false);
            queryClient.invalidateQueries({ queryKey: ['getTasksNoPlanificationDate', id] });
            queryClient.invalidateQueries({ queryKey: ['getTasksForCalendar', id] });
        },
        onError: (error) => {
            toast.error(error.message)
        },
    });

    useEffect(() => {
        if (tasksForCalendar) {
            const calendarApi = calendarRef.current?.getApi();
            if (calendarApi && tasksForCalendar.initial_date) {
                calendarApi.gotoDate(tasksForCalendar.initial_date);
            }
        }
    }, [tasksForCalendar]);


    const handleEventDrop = (info: EventReceiveInfo) => {
        mutate({ date: info.event.startStr, ids: [info.event.id] });
    };

    interface DateClickInfo {
        dateStr: string;
    }

    const handleOpenDate = (info: DateClickInfo) => {
        navigate(`${location.pathname}?date=${info.dateStr}`);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col w-full">
                <h1 className="font-bold text-4xl">Planificación Fincas</h1>
                {hasPermission('administrate plans production') && (
                    <div className="flex justify-end items-center gap-5 mb-4">
                        <Bars3Icon className="hover:text-gray-300 cursor-pointer block w-6" onClick={() => setSeeTasks(!seeTasks)} />
                    </div>
                )}

            </div>

            <div className="flex gap-4">
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 flex-1">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale={esLocale}
                        editable={true}
                        droppable={true}
                        events={tasksForCalendar?.data}
                        initialDate={tasksForCalendar?.initial_date}
                        dateClick={handleOpenDate}
                        eventDrop={handleEventDrop}
                        eventClick={(info) => {
                            const task = tasksForCalendar?.data.find((task) => task.id === info.event.id);
                            if (task) {
                                setSelectedTask(task);
                                setModalInfoTarea(true);
                            }
                        }}
                        dayMaxEventRows={true}
                    />
                </div>

                <div className={`flex flex-col w-2/5 space-y-5 ${!seeTasks ? 'hidden' : ''}`}>
                    <aside
                        className={`bg-white rounded-lg border border-gray-200 shadow-md max-h-screen overflow-y-auto scrollbar-hide`}
                    >
                        <div className='sticky top-0 bg-white z-10 p-4'>
                            <h2 className="text-lg font-semibold text-gray-700 border-b mb-4">
                                Tareas sin fecha de operación
                            </h2>
                            <div className='flex justify-between items-center mb-2'>
                                <p className='text-gray-700 font-bold mb-2'>Tareas seleccionadas: {ids.length}</p>
                                <Trash className='w-4 h-4 cursor-pointer hover:text-gray-400' onClick={() => setIds([])} />
                            </div>
                            <button disabled={ids.length === 0} className={`button ${ids.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer'} w-full`} onClick={() => setModal(true)}>
                                Cambiar Fecha de Operación
                            </button>

                            <div className='flex flex-col justify-between mt-4 gap-5 text-xs'>
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
                            </div>
                        </div>

                        {isLoading && <Spinner />}
                        <div className="space-y-3 mt-2 p-4">
                            {tasks?.length === 0 ? (
                                <p className='text-gray-400 text-sm text-center'>No existen tareas</p>
                            ) : (
                                <>
                                    {tasks?.map((task) => (
                                        <TaskCalendarFincaComponent key={task.id} ids={ids} setIds={setIds} task={task} />
                                    ))}
                                </>
                            )}

                        </div>
                    </aside>

                    <div className="bg-white p-4 rounded-lg shadow-sm border text-sm ">
                        <h2 className="text-lg font-semibold mb-2 text-gray-700">Resumen de Tareas</h2>
                        <div className="space-y-1 text-gray-600">
                            <p><span className="font-medium text-gray-800">Tareas con fecha de operación:</span> {tasksForCalendar?.tasks_with_operation_date}</p>
                            <p><span className="font-medium text-gray-800">Tareas sin fecha de operación:</span> {tasksForCalendar?.tasks_without_operation_date}</p>
                        </div>
                    </div>
                </div>
            </div>


            <ModalChangeOperationDateAgricola show={modal} setModal={setModal} ids={ids} id={id} setIds={setIds} />
            <ModalInfoTareaLote show={modalInfoTarea} setModal={setModalInfoTarea} task={selectedTask} setSelectedTask={setSelectedTask} />
            <ModalInsumosPrepared id={id} />
        </div>
    );
};

export default CalendarComponent;
