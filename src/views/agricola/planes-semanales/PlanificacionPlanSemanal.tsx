import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { changeOperationDate, getTasksForCalendar, getTasksNoPlanificationDate, TaskForCalendar } from '@/api/TasksWeeklyPlanAPI';
import { getAllPlans } from '@/api/WeeklyPlansAPI';
import { Bars3Icon } from '@heroicons/react/16/solid';
import { EventDropArg } from '@fullcalendar/core/index.js';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import TaskCalendarFincaComponent from '@/components/planes-semanales-finca/TaskCalendarFincaComponent';
import Spinner from '@/components/utilities-components/Spinner';
import ModalChangeOperationDateAgricola from '@/components/modals/ModalChangeOperationDateAgricola';
import ModalInfoTareaLote from '@/components/modals/ModalInfoTareaLote';

const CalendarComponent = () => {
    const externalEventsRef = useRef(null);
    const [id, setId] = useState<string>('');
    const [events, setEvents] = useState<TaskForCalendar[]>([]);
    const [seeTasks, setSeeTasks] = useState<boolean>(false);
    const [modal, setModal] = useState<boolean>(false);
    const [modalInfoTarea, setModalInfoTarea] = useState<boolean>(false);
    const [ids, setIds] = useState<string[]>([]);
    const [selectedTask, setSelectedTask] = useState<TaskForCalendar>({} as TaskForCalendar);
    const queryClient = useQueryClient();

    const { data: plans } = useQuery({
        queryKey: ['getAllPlans'],
        queryFn: getAllPlans
    });

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['getTasksNoPlanificationDate', id],
        queryFn: () => getTasksNoPlanificationDate(id),
        enabled: !!id,
    });


    const { data: tasksForCalendar } = useQuery({
        queryKey: ['getTasksForCalendar', id],
        queryFn: () => getTasksForCalendar(id),
        enabled: !!id,
    });

    const { mutate } = useMutation({
        mutationFn: changeOperationDate,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            setModal(false);
            queryClient.invalidateQueries({ queryKey: ['getTasksNoPlanificationDate', id] });
            queryClient.invalidateQueries({ queryKey: ['getTasksForCalendar', id] });
        },
    });

    useEffect(() => {
        if (tasksForCalendar) {
            setEvents(tasksForCalendar);
        }
    }, [tasksForCalendar]);

    const handleEventDrop = async (info: EventDropArg) => {
        const ids = [info.event.id];
        mutate({ date: info.event.startStr, ids });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className='flex flex-col w-full'>
                <h1 className='font-bold text-4xl'>Planificación Fincas</h1>
                <div className='flex justify-end items-center gap-5 mb-4'>
                    <Bars3Icon className="hover:text-gray-300 cursor-pointer block w-6" onClick={() => setSeeTasks(!seeTasks)} />
                    <div className="mb-4">
                        <label htmlFor="selector" className="block text-sm font-medium text-gray-600 mb-1">
                            Plan Semanal
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => setId(e.target.value)}
                        >
                            <option value="">Seleccione una opción</option>
                            {plans?.map((plan) => (
                                <option key={plan.id} value={plan.id}>{plan.finca} - {plan.week}/{plan.year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {ids.length > 0 && (
                    <div className='mb-10'>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex justify-end gap-5"
                        >
                            <button className='button bg-indigo-500 hover:bg-indigo-600' onClick={() => setModal(true)}>
                                Cambiar Fecha de Operación
                            </button>
                        </motion.div>
                    </div>
                )}
            </div>

            <div className='flex gap-4'>
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 flex-1">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        droppable={true}
                        eventDrop={handleEventDrop}
                        editable={true}
                        locale={esLocale}
                        dayMaxEventRows={true}
                        eventClick={(info) => {
                            setModalInfoTarea(true);
                            setSelectedTask(tasksForCalendar?.find((task) => task.id === info.event.id) as TaskForCalendar);
                        }}
                    />
                </div>

                <aside
                    ref={externalEventsRef}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-md max-h-screen overflow-y-auto scrollbar-hide"
                    hidden={!seeTasks}
                >
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                            Tareas sin fecha de operación
                        </h2>
                    </div>
                    {isLoading && <Spinner />}

                    <div className="space-y-3">
                        {tasks?.map((task) => (
                            <TaskCalendarFincaComponent ids={ids} setIds={setIds} key={task.id} task={task} />
                        ))}
                    </div>
                </aside>
            </div>

            <ModalChangeOperationDateAgricola show={modal} setModal={setModal} ids={ids} id={id} setIds={setIds} />
            <ModalInfoTareaLote show={modalInfoTarea} setModal={setModalInfoTarea} task={selectedTask} setSelectedTask={setSelectedTask} />
        </div>
    );
};

export default CalendarComponent;
