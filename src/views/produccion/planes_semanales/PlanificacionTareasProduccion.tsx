import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllTasksWeeklyProductionPlan, getTasksOperationDate, TaskProductionEvents, TaskProductionNoOperationDate } from '@/api/WeeklyProductionPlanAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from "@fullcalendar/core/locales/es";
import interactionPlugin from "@fullcalendar/interaction";
import Spinner from '@/components/utilities-components/Spinner';
import TaskScheduled from '@/components/produccion/TaskScheduled';
import ShowErrorAPI from '@/components/utilities-components/ShowErrorAPI';
import TaskUnscheduled from '@/components/produccion/TaskUnscheduled';

type DateClickInfo = {
  dateStr: string;
}

export default function CalendarTasks() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date')!;
  const show = (date) ? true : false;
  const params = useParams();
  const plan_id = params.plan_id!!;

  const [selectedDate, setSelectedDate] = useState<string>(date);
  const [events, setEvents] = useState<TaskProductionEvents[]>([]);
  const [tasksNoOperationDate, setTaskNoOperationDate] = useState<TaskProductionNoOperationDate[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');

  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getTasksNoOperationDate', plan_id],
    queryFn: () => getAllTasksWeeklyProductionPlan(plan_id),
  });

  const { data: programedTasks, isLoading: programedTasksLoading } = useQuery({
    queryKey: ['getTasksOperationDate', date],
    queryFn: () => getTasksOperationDate(date),
    enabled: show
  });

  useEffect(() => {
    if (data) {
      setEvents(data.events);
      setTaskNoOperationDate(data.tasks);
    }
  }, [data]);

  const handleClickDate = (info: DateClickInfo) => {
    navigate(`${location.pathname}?date=${info.dateStr}`);
    setSelectedDate(info.dateStr);
  }

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-4xl mb-4">Planificación Producción</h1>

      <div className="flex gap-5 p-5">
        <div className="flex-1 border p-5 rounded-lg bg-white shadow max-h-screen overflow-y-auto scrollbar-hide space-y-6">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            locale={esLocale}
            dateClick={handleClickDate}
            dayCellClassNames={(arg) =>
              arg.date.toISOString().split('T')[0] === selectedDate
                ? ['bg-indigo-200']
                : []
            }
          />

          <div className="border-t pt-4">
            <h2 className="text-2xl font-bold">Tareas programadas: {date || '—'}</h2>
            <div className='mt-5 overflow-y-auto scrollbar-hide max-h-96 space-y-6'>
              {programedTasksLoading && <Spinner />}
              {programedTasks?.map(pTask => (
                <TaskScheduled key={pTask.id} task={pTask} selectedId={selectedId} setSelectedId={setSelectedId} />
              ))}
            </div>
          </div>
        </div>

        <div className="w-96 p-5 border rounded-lg bg-white shadow overflow-y-auto scrollbar-hide space-y-5 max-h-screen">
          <h2 className='font-bold text-2xl'>Tareas Sin Programación</h2>
          {isError && <ShowErrorAPI />}
          {isLoading && <Spinner />}
          {tasksNoOperationDate?.map(task => (
            <TaskUnscheduled key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  )
}
