import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Bars3Icon } from '@heroicons/react/16/solid';
import { Trash } from 'lucide-react';
import { changeOperationDate, getTasksForCalendar, getTasksNoPlanificationDate, TaskForCalendar } from '@/api/TasksWeeklyPlanAPI';
import { getLotes, Lote } from '@/api/LotesAPI';
import { Tarea } from '@/types';
import { getWeeklyPlans } from '@/api/WeeklyPlansAPI';
import { FiltersPlanSemanalInitialValues } from './IndexPlanSemanal';
import { getTasks } from '@/api/TasksAPI';
import { FiltersLoteInitialValues } from '../lotes/IndexLotes';
import { FiltersTasksInitialValues } from '../tareas/IndexTareas';
import Select from "react-select";
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import Spinner from '@/components/utilities-components/Spinner';
import TaskCalendarFincaComponent from '@/components/planes-semanales-finca/TaskCalendarFincaComponent';
import ModalChangeOperationDateAgricola from '@/components/modals/ModalChangeOperationDateAgricola';
import ModalInfoTareaLote from '@/components/modals/ModalInfoTareaLote';


type EventReceiveInfo = {
    event: {
        id: string;
        startStr: string;
    };
}

const CalendarComponent = () => {
    const queryClient = useQueryClient();
    const [id, setId] = useState('');
    const [events, setEvents] = useState<TaskForCalendar[]>([]);
    const [ids, setIds] = useState<string[]>([]);
    const [seeTasks, setSeeTasks] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalInfoTarea, setModalInfoTarea] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskForCalendar>({} as TaskForCalendar);
    const calendarRef = useRef<FullCalendar | null>(null);

    const [loteId, setLoteId] = useState<string>('');
    const [taskId, setTaskId] = useState<string>('');

    const [lotes, setLotes] = useState<Lote[]>([]);
    const [tareas, setTareas] = useState<Tarea[]>([]);

    const results = useQueries({
        queries: [
            { queryKey: ['getAllLotes'], queryFn: () => getLotes({ page: 1, filters: FiltersLoteInitialValues, paginated: false }) },
            { queryKey: ['getAllTasks'], queryFn: () => getTasks({ page: 1, filters: FiltersTasksInitialValues, paginated: false }) },
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

    const { data: plans } = useQuery({ queryKey: ['getAllPlans'], queryFn: () => getWeeklyPlans({ page: 1, filters: FiltersPlanSemanalInitialValues, paginated: false }) });
    const { data: tasks, isLoading } = useQuery({
        queryKey: ['getTasksNoPlanificationDate', id, loteId, taskId],
        queryFn: () => getTasksNoPlanificationDate({ id, loteId, taskId }),
        enabled: !!id,
    });
    const { data: tasksForCalendar } = useQuery({
        queryKey: ['getTasksForCalendar', id],
        queryFn: () => getTasksForCalendar(id),
        enabled: !!id,
    });

    const { mutate } = useMutation({
        mutationFn: changeOperationDate,
        onSuccess: (data) => {
            toast.success(data);
            setModal(false);
            queryClient.invalidateQueries({ queryKey: ['getTasksNoPlanificationDate', id] });
            queryClient.invalidateQueries({ queryKey: ['getTasksForCalendar', id] });
        },
        onError: (error) => toast.error(error.message),
    });

    useEffect(() => {
        if (tasksForCalendar) {
            setEvents(tasksForCalendar.data);

            const calendarApi = calendarRef.current?.getApi();
            if (calendarApi && tasksForCalendar.initial_date) {
                calendarApi.gotoDate(tasksForCalendar.initial_date);
            }
        }
    }, [tasksForCalendar]);


    const handleEventDrop = (info: EventReceiveInfo) => {
        mutate({ date: info.event.startStr, ids: [info.event.id] });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col w-full">
                <h1 className="font-bold text-4xl">Planificación Fincas</h1>
                <div className="flex justify-end items-center gap-5 mb-4">
                    <Bars3Icon className="hover:text-gray-300 cursor-pointer block w-6" onClick={() => setSeeTasks(!seeTasks)} />
                    <div className="mb-4">
                        <label htmlFor="selector" className="block text-sm font-medium text-gray-600 mb-1">Plan Semanal</label>
                        <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => setId(e.target.value)}
                        >
                            <option value="">Seleccione una opción</option>
                            {plans?.data?.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.finca} - {plan.week}/{plan.year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
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
                        events={events}
                        initialDate={tasksForCalendar?.initial_date}
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
                                        <div
                                            key={task.id}
                                            className="fc-task-draggable space-y-5"
                                            data-id={task.id}
                                            data-title={task.task}
                                            draggable="true"

                                        >
                                            <TaskCalendarFincaComponent ids={ids} setIds={setIds} task={task} />
                                        </div>
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
        </div>
    );
};

export default CalendarComponent;
