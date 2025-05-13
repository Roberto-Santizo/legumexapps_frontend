import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllWeeklyProductionPlans, getTasksNoOperationDate, getTasksOperationDate } from '@/api/WeeklyProductionPlanAPI';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from "@fullcalendar/core/locales/es";
import interactionPlugin from "@fullcalendar/interaction";
import TaskUnscheduled from '@/components/produccion/TaskUnscheduled';
import Spinner from '@/components/utilities-components/Spinner';
import ShowErrorAPI from '@/components/utilities-components/ShowErrorAPI';
import TaskScheduled from '@/components/produccion/TaskScheduled';

type DateClickInfo = {
  dateStr: string;
}

export default function CalendarTasks() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [id, setId] = useState<string>('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getTasksNoOperationDate', id],
    queryFn: () => getTasksNoOperationDate(id),
    enabled: !!id
  });

  const { data: programedTasks, isLoading: programedTasksLoading } = useQuery({
    queryKey: ['getTasksOperationDate', selectedDate],
    queryFn: () => getTasksOperationDate(selectedDate),
    enabled: !!selectedDate
  });

  const { data: weeklyPlans } = useQuery({
    queryKey: ['getAllWeeklyProductionPlans'],
    queryFn: getAllWeeklyProductionPlans,
  });

  const handleClickDate = (info: DateClickInfo) => {
    if (info.dateStr === selectedDate) {
      setSelectedDate('');
      return;
    }
    setSelectedDate(info.dateStr);
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col w-full">
        <h1 className="font-bold text-4xl mb-4">Planificación Producción</h1>

        <div className="flex justify-end items-center gap-5">
          <div>
            <label htmlFor="selector" className="block text-sm font-medium text-gray-600 mb-1">Plan Semanal</label>
            <select
              id="selector"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setId(e.target.value)}
            >
              <option value="">Seleccione una opción</option>
              {weeklyPlans?.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  SEMANA {plan.week} - {plan.year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-5 p-5">
        <div className="flex-1 border p-5 rounded-lg bg-white shadow max-h-screen overflow-y-auto scrollbar-hide space-y-6">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={[]}
            locale={esLocale}
            dateClick={handleClickDate}
            dayCellClassNames={(arg) =>
              arg.date.toISOString().split('T')[0] === selectedDate
                ? ['bg-indigo-200']
                : []
            }
          />

          <div className="border-t pt-4">
            <h2 className="text-2xl font-bold">Tareas programadas: {selectedDate || '—'}</h2>
            <div className='mt-5 overflow-y-auto scrollbar-hide max-h-96 space-y-6'>
              {programedTasksLoading && <Spinner />}
              {programedTasks?.map(pTask => (
                <TaskScheduled key={pTask.id} task={pTask} selectedDate={selectedDate} selectedId={selectedId} setSelectedId={setSelectedId} />
              ))}
            </div>
          </div>
        </div>

        <div className="w-96 p-5 border rounded-lg bg-white shadow overflow-y-auto scrollbar-hide space-y-5 max-h-screen">
          <h2 className='font-bold text-2xl'>Tareas Sin Programación</h2>
          {isError && <ShowErrorAPI />}
          {isLoading && <Spinner />}
          {data?.map(task => (
            <TaskUnscheduled key={task.id} selectedDate={selectedDate} task={task} id={id} />
          ))}
        </div>
      </div>
    </div>
  )
}
